"use client";

import { useActionState } from "react";
import { importGuests, login, removeParty } from "@/app/rsvp/responses/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, {});
  return (
    <form action={action} className="rsvp-step">
      <div className="rsvp-search">
        <div className="rsvp-field">
          <label htmlFor="admin-password">Password</label>
          <input id="admin-password" name="password" type="password" required autoFocus />
        </div>
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? "Checking…" : "Sign in"}
        </button>
      </div>
      {state.error && (
        <p className="rsvp-message rsvp-message--error" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}

export function ImportForm() {
  const [state, action, pending] = useActionState(importGuests, {});
  return (
    <form action={action} className="admin-import">
      <div className="rsvp-field">
        <label htmlFor="admin-guests">Add guests</label>
        <textarea
          id="admin-guests"
          name="guests"
          rows={6}
          required
          placeholder={"John Smith, Jane Smith\nAunt Carol Jones\nMike Brown, +1"}
        />
        <p className="rsvp-hint">
          One invitation per line. Separate the people on an invitation with commas, or paste rows
          straight from a spreadsheet. Write <strong>+1</strong> for an unnamed plus-one. Anyone
          already on the list is skipped, so it&rsquo;s safe to paste the same list twice.
        </p>
      </div>
      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? "Adding…" : "Add to guest list"}
      </button>
      {state.error && (
        <p className="rsvp-message rsvp-message--error" role="alert">
          {state.error}
        </p>
      )}
      {state.result && (
        <div className="rsvp-message" role="status">
          <p>
            Added {state.result.added} invitation{state.result.added === 1 ? "" : "s"}.
          </p>
          {state.result.skipped.length > 0 && (
            <p>
              Skipped because someone on the line is already invited:{" "}
              {state.result.skipped.join(" · ")}
            </p>
          )}
          {state.result.invalid.length > 0 && (
            <p>
              Skipped because each person needs a first and last name:{" "}
              {state.result.invalid.join(" · ")}
            </p>
          )}
        </div>
      )}
    </form>
  );
}

export function RemoveButton({ partyId, names }: { partyId: number; names: string }) {
  return (
    <form
      action={removeParty}
      onSubmit={(event) => {
        if (!confirm(`Remove the invitation for ${names}? Their RSVP will be deleted too.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="partyId" value={partyId} />
      <button type="submit" className="rsvp-link">
        Remove
      </button>
    </form>
  );
}
