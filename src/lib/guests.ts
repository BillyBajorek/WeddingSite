import "server-only";
import { query, transaction } from "@/lib/db";

export type Guest = {
  id: number;
  name: string;
  isPlusOne: boolean;
  attending: boolean | null;
  meal: string | null;
};

// What a guest sees after finding their invitation. Email and private notes are
// left out because anyone who knows a name can open that name's invitation.
export type Invitation = {
  id: number;
  guests: Guest[];
  songRequest: string;
  /** Set when this invitation was marked for a couple's first-dance song. */
  offerFirstDance: boolean;
  firstDanceSong: string;
  dietary: string;
  respondedAt: string | null;
};

export type PartyRecord = Invitation & {
  email: string;
  notes: string;
  createdAt: string;
};

export type GuestAnswer = {
  id: number;
  attending: boolean;
  name: string;
};

export type RsvpSubmission = {
  partyId: number;
  guests: GuestAnswer[];
  email: string;
  songRequest: string;
  firstDanceSong: string;
  dietary: string;
  notes: string;
};

type GuestRow = {
  id: number;
  party_id: number;
  name: string;
  is_plus_one: boolean;
  attending: boolean | null;
  meal: string | null;
};

type PartyRow = {
  id: number;
  email: string;
  song_request: string;
  offer_first_dance: boolean;
  first_dance_song: string;
  dietary: string;
  notes: string;
  responded_at: Date | null;
  created_at: Date;
};

const suffixes = new Set(["jr", "sr", "ii", "iii", "iv"]);

export function nameTokens(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .split(/[\s-]+/)
    .filter((token) => token && !suffixes.has(token));
}

function sameFirstName(typed: string, stored: string) {
  if (typed === stored) return true;
  // Lets "Chris" find "Christopher" (and the reverse) without matching on one or two letters.
  const shorter = typed.length < stored.length ? typed : stored;
  const longer = shorter === typed ? stored : typed;
  return shorter.length >= 3 && longer.startsWith(shorter);
}

export function namesMatch(typed: string[], stored: string[]) {
  if (typed.length < 2 || stored.length < 2) return false;
  if (typed.join(" ") === stored.join(" ")) return true;
  return typed.at(-1) === stored.at(-1) && sameFirstName(typed[0], stored[0]);
}

function toGuest(row: GuestRow): Guest {
  return {
    id: row.id,
    name: row.name,
    isPlusOne: row.is_plus_one,
    attending: row.attending,
    meal: row.meal,
  };
}

function toParty(row: PartyRow, guests: GuestRow[]): PartyRecord {
  return {
    id: row.id,
    guests: guests.filter((guest) => guest.party_id === row.id).map(toGuest),
    email: row.email,
    songRequest: row.song_request,
    offerFirstDance: row.offer_first_dance,
    firstDanceSong: row.first_dance_song,
    dietary: row.dietary,
    notes: row.notes,
    respondedAt: row.responded_at?.toISOString() ?? null,
    createdAt: row.created_at.toISOString(),
  };
}

function toInvitation({
  id,
  guests,
  songRequest,
  offerFirstDance,
  firstDanceSong,
  dietary,
  respondedAt,
}: PartyRecord): Invitation {
  return { id, guests, songRequest, offerFirstDance, firstDanceSong, dietary, respondedAt };
}

async function loadParties(partyIds?: number[]) {
  const filter = partyIds ? "where id = any($1)" : "";
  const guestFilter = partyIds ? "where party_id = any($1)" : "";
  const values = partyIds ? [partyIds] : [];
  const [parties, guests] = await Promise.all([
    query<PartyRow>(`select * from parties ${filter} order by id`, values),
    query<GuestRow>(`select * from guests ${guestFilter} order by party_id, position, id`, values),
  ]);
  return parties.map((party) => toParty(party, guests));
}

export async function findInvitations(name: string, limit = 5): Promise<Invitation[]> {
  const typed = nameTokens(name);
  if (typed.length < 2) return [];
  const guests = await query<GuestRow>(
    "select id, party_id, name from guests where not is_plus_one or name <> ''",
  );
  const partyIds = [
    ...new Set(
      guests.filter((guest) => namesMatch(typed, nameTokens(guest.name))).map((g) => g.party_id),
    ),
  ].slice(0, limit);
  if (!partyIds.length) return [];
  return (await loadParties(partyIds)).map(toInvitation);
}

export type SaveOutcome = Invitation | "not-found" | "plus-one-unnamed";

export async function saveRsvp(submission: RsvpSubmission): Promise<SaveOutcome> {
  const outcome = await transaction(async (client) => {
    const party = await client.query<{ offer_first_dance: boolean }>(
      "select offer_first_dance from parties where id = $1 for update",
      [submission.partyId],
    );
    if (!party.rowCount) return "not-found" as const;
    const offerFirstDance = party.rows[0].offer_first_dance;

    const existing = await client.query<GuestRow>("select * from guests where party_id = $1", [
      submission.partyId,
    ]);
    const answers = new Map(submission.guests.map((answer) => [answer.id, answer]));
    if (
      answers.size !== existing.rowCount ||
      existing.rows.some((guest) => !answers.has(guest.id))
    ) {
      return "not-found" as const;
    }
    if (
      existing.rows.some((guest) => {
        const answer = answers.get(guest.id)!;
        return guest.is_plus_one && answer.attending && !answer.name;
      })
    ) {
      return "plus-one-unnamed" as const;
    }

    for (const guest of existing.rows) {
      const answer = answers.get(guest.id)!;
      await client.query("update guests set attending = $2, meal = null, name = $3 where id = $1", [
        guest.id,
        answer.attending,
        guest.is_plus_one ? answer.name : guest.name,
      ]);
    }

    await client.query(
      `update parties set
         email = coalesce(nullif($2, ''), email),
         song_request = $3,
         first_dance_song = $4,
         dietary = $5,
         notes = coalesce(nullif($6, ''), notes),
         responded_at = now()
       where id = $1`,
      [
        submission.partyId,
        submission.email,
        submission.songRequest,
        offerFirstDance && submission.guests.some((guest) => guest.attending)
          ? submission.firstDanceSong
          : "",
        submission.dietary,
        submission.notes,
      ],
    );
    return "saved" as const;
  });
  if (outcome !== "saved") return outcome;
  const [party] = await loadParties([submission.partyId]);
  return toInvitation(party);
}

export function listParties() {
  return loadParties();
}

export async function deleteParty(partyId: number) {
  await query("delete from parties where id = $1", [partyId]);
}

const plusOneToken = /^(\+\s*1|plus[\s-]?one|guest)$/i;

export type ImportResult = { added: number; skipped: string[]; invalid: string[] };

// One party per line; names separated by commas or tabs (so rows pasted from a
// spreadsheet work). "+1", "Plus One", or "Guest" adds an unnamed plus-one.
// A trailing "married" asks that couple for their first dance song.
export async function importGuestList(text: string): Promise<ImportResult> {
  const result: ImportResult = { added: 0, skipped: [], invalid: [] };
  const existing = await query<{ name: string }>("select name from guests where name <> ''");
  const known = new Set(existing.map((guest) => nameTokens(guest.name).join(" ")));
  const parties: { guests: { name: string; isPlusOne: boolean }[]; offerFirstDance: boolean }[] = [];

  for (const line of text.split(/\r?\n/)) {
    const cells = line
      .split(/[,\t]/)
      .map((cell) => cell.trim().replace(/\s+/g, " "))
      .filter(Boolean);
    if (!cells.length) continue;

    // A trailing "married" marks the invitation for a couple's first-dance song.
    const offerFirstDance = /^(married|first[\s-]?dance)$/i.test(cells.at(-1) ?? "");
    const people = offerFirstDance ? cells.slice(0, -1) : cells;
    const guests = people.map((cell) =>
      plusOneToken.test(cell) ? { name: "", isPlusOne: true } : { name: cell, isPlusOne: false },
    );
    const named = guests.filter((guest) => !guest.isPlusOne);
    if (
      !named.length ||
      guests.length > 12 ||
      named.some((guest) => guest.name.length > 100 || nameTokens(guest.name).length < 2)
    ) {
      result.invalid.push(line.trim());
      continue;
    }
    const keys = named.map((guest) => nameTokens(guest.name).join(" "));
    if (keys.some((key) => known.has(key))) {
      result.skipped.push(line.trim());
      continue;
    }
    keys.forEach((key) => known.add(key));
    parties.push({ guests, offerFirstDance });
  }

  await transaction(async (client) => {
    for (const { guests, offerFirstDance } of parties) {
      const party = await client.query<{ id: number }>(
        "insert into parties (offer_first_dance) values ($1) returning id",
        [offerFirstDance],
      );
      for (const [position, guest] of guests.entries()) {
        await client.query(
          "insert into guests (party_id, position, name, is_plus_one) values ($1, $2, $3, $4)",
          [party.rows[0].id, position, guest.name, guest.isPlusOne],
        );
      }
    }
  });
  result.added = parties.length;
  return result;
}
