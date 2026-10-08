"use server";

import { DatabaseNotConfiguredError } from "@/lib/db";
import {
  findInvitations,
  nameTokens,
  saveRsvp,
  type GuestAnswer,
  type Invitation,
  type RsvpSubmission,
} from "@/lib/guests";

export type LookupResult = { invitations: Invitation[] } | { error: string };
export type SubmitResult = { invitation: Invitation } | { error: string };

const unavailable = "RSVPs aren't open yet. Please check back soon!";
const failed = "Something went wrong on our end. Please try again in a moment.";

function failure(error: unknown) {
  if (error instanceof DatabaseNotConfiguredError) return { error: unavailable };
  console.error(error);
  return { error: failed };
}

const text = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function lookupInvitation(name: string): Promise<LookupResult> {
  const typed = text(name, 120);
  if (nameTokens(typed).length < 2) {
    return { error: "Please enter both your first and last name." };
  }
  try {
    const invitations = await findInvitations(typed);
    if (!invitations.length) {
      return {
        error:
          "We couldn't find that name. Try it the way it's written on your invitation, or reach out to us and we'll sort it out.",
      };
    }
    return { invitations };
  } catch (error) {
    return failure(error);
  }
}

export async function submitRsvp(input: RsvpSubmission): Promise<SubmitResult> {
  const partyId = Number(input?.partyId);
  if (!Number.isInteger(partyId) || !Array.isArray(input.guests) || !input.guests.length) {
    return { error: "Please look up your invitation again." };
  }

  const guests: GuestAnswer[] = [];
  for (const raw of input.guests.slice(0, 12)) {
    if (typeof raw?.attending !== "boolean") {
      return { error: "Please let us know whether each guest will be attending." };
    }
    guests.push({
      id: Number(raw.id),
      attending: raw.attending,
      name: text(raw.name, 100),
    });
  }

  const email = text(input.email, 200);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "That email address doesn't look quite right." };
  }

  try {
    const outcome = await saveRsvp({
      partyId,
      guests,
      email,
      songRequest: text(input.songRequest, 200),
      firstDanceSong: text(input.firstDanceSong, 200),
      dietary: text(input.dietary, 1000),
      notes: text(input.notes, 2000),
    });
    if (outcome === "not-found") return { error: "Please look up your invitation again." };
    if (outcome === "plus-one-unnamed") return { error: "Please add your guest's name." };
    return { invitation: outcome };
  } catch (error) {
    return failure(error);
  }
}
