import { mealLabel } from "@/content/rsvp";
import { isAdmin } from "@/lib/admin";
import { listParties } from "@/lib/guests";

// Guests type these fields, so neutralize anything a spreadsheet would run as a formula.
function cell(value: string | number) {
  let text = String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export async function GET() {
  if (!(await isAdmin())) return new Response("Not signed in", { status: 401 });

  const header = ["Invitation", "Guest", "Plus one", "Status", "Meal", "Email", "Song request", "Dietary", "Notes", "Replied at"];
  const rows = (await listParties()).flatMap((party) =>
    party.guests.map((guest) => [
      party.id,
      guest.name,
      guest.isPlusOne ? "Yes" : "",
      guest.attending === null ? "Awaiting reply" : guest.attending ? "Attending" : "Declined",
      guest.attending ? mealLabel(guest.meal) : "",
      party.email,
      party.songRequest,
      party.dietary,
      party.notes,
      party.respondedAt ?? "",
    ]),
  );
  const csv = [header, ...rows].map((row) => row.map(cell).join(",")).join("\r\n");

  return new Response(`\uFEFF${csv}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="rsvps.csv"',
      "Cache-Control": "no-store",
    },
  });
}
