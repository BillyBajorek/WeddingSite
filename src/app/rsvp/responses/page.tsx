import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { ImportForm, LoginForm, RemoveButton } from "@/components/rsvp/admin-forms";
import { mealLabel, meals } from "@/content/rsvp";
import { ADMIN_PATH, adminConfigured, isAdmin } from "@/lib/admin";
import { listParties, type Guest } from "@/lib/guests";
import { logout } from "./actions";

export const metadata: Metadata = {
  title: "RSVP responses",
  robots: { index: false, follow: false },
};

export default function ResponsesPage() {
  return (
    <main id="main" className="rsvp-page" tabIndex={-1}>
      <div className="card rsvp-card rsvp-card--wide">
        <h1 className="section-title rsvp-title">Responses</h1>
        <Suspense fallback={<p className="rsvp-lede">Loading…</p>}>
          <Responses />
        </Suspense>
      </div>
    </main>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return <div className="rsvp-message admin-notice">{children}</div>;
}

const status = (guest: Guest) =>
  guest.attending === null ? "Awaiting reply" : guest.attending ? "Attending" : "Declined";

async function Responses() {
  await connection();

  if (!adminConfigured()) {
    return (
      <Notice>
        <p>
          To use this page, add a secret named <strong>ADMIN_PASSWORD</strong> in Replit (Tools →
          Secrets) and restart the app. That password is what you&rsquo;ll type here.
        </p>
      </Notice>
    );
  }
  if (!(await isAdmin())) return <LoginForm />;
  if (!process.env.DATABASE_URL) {
    return (
      <Notice>
        <p>
          No database yet. In Replit, open <strong>Database</strong> from the Tools list and create
          a PostgreSQL database, then restart the app. Replit connects it to the site
          automatically.
        </p>
      </Notice>
    );
  }

  const parties = await listParties();
  const guests = parties.flatMap((party) => party.guests);
  const attending = guests.filter((guest) => guest.attending);
  const declined = guests.filter((guest) => guest.attending === false).length;
  const stats = [
    { label: "Invited", value: guests.length },
    { label: "Attending", value: attending.length },
    { label: "Declined", value: declined },
    { label: "Awaiting reply", value: guests.length - attending.length - declined },
  ];

  return (
    <div className="admin">
      <div className="admin-toolbar">
        <a className="btn btn-outline" href={`${ADMIN_PATH}/export`} download>
          Download spreadsheet
        </a>
        <form action={logout}>
          <button type="submit" className="rsvp-link">
            Sign out
          </button>
        </form>
      </div>

      <dl className="admin-stats">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt>{stat.label}</dt>
            <dd>{stat.value}</dd>
          </div>
        ))}
      </dl>
      {attending.length > 0 && (
        <p className="admin-meals">
          {meals
            .map(
              (meal) =>
                `${meal.label}: ${attending.filter((guest) => guest.meal === meal.value).length}`,
            )
            .join(" · ")}
        </p>
      )}

      <ImportForm />

      <h2 className="rsvp-step-title">Invitations ({parties.length})</h2>
      {parties.length === 0 ? (
        <p className="rsvp-lede">No one on the guest list yet. Add guests above.</p>
      ) : (
        <ul className="admin-parties">
          {parties.map((party) => {
            const names = party.guests.map((guest) => guest.name || "Guest").join(", ");
            const extras = [
              ["Email", party.email],
              ["Song", party.songRequest],
              ["Dietary", party.dietary],
              ["Notes", party.notes],
            ].filter(([, value]) => value);
            return (
              <li key={party.id} className="admin-party">
                <ul className="admin-guests">
                  {party.guests.map((guest) => (
                    <li key={guest.id}>
                      <span className="rsvp-summary-name">
                        {guest.name || (guest.isPlusOne ? "Plus one" : "Guest")}
                      </span>
                      <span className={`admin-status admin-status--${status(guest).split(" ")[0].toLowerCase()}`}>
                        {status(guest)}
                        {guest.attending && guest.meal ? ` · ${mealLabel(guest.meal)}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
                {extras.length > 0 && (
                  <dl className="admin-extras">
                    {extras.map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                <div className="admin-party-foot">
                  <span>
                    {party.respondedAt
                      ? `Replied ${new Date(party.respondedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          timeZone: "America/Detroit",
                        })}`
                      : "No reply yet"}
                  </span>
                  <RemoveButton partyId={party.id} names={names} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
