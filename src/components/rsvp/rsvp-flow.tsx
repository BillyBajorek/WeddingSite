"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { lookupInvitation, submitRsvp } from "@/app/rsvp/actions";
import { rsvpCopy } from "@/content/rsvp";
import type { Invitation } from "@/lib/guests";

type Answer = { attending: boolean | null; name: string };
type Step = "search" | "choose" | "form" | "done";

const partyNames = (invitation: Invitation) =>
  invitation.guests.map((guest) => guest.name || "Guest").join(", ");

const respondedOn = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

function answersFor(invitation: Invitation): Record<number, Answer> {
  return Object.fromEntries(
    invitation.guests.map((guest) => [
      guest.id,
      { attending: guest.attending, name: guest.name },
    ]),
  );
}

export function RsvpFlow() {
  const [step, setStep] = useState<Step>("search");
  const [name, setName] = useState("");
  const [matches, setMatches] = useState<Invitation[]>([]);
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [email, setEmail] = useState("");
  const [firstDanceSong, setFirstDanceSong] = useState("");
  const [firstDanceArtist, setFirstDanceArtist] = useState("");
  const [dietary, setDietary] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const movedRef = useRef(false);

  useEffect(() => {
    if (movedRef.current) headingRef.current?.focus();
    movedRef.current = true;
  }, [step]);

  function goTo(next: Step) {
    setError("");
    setStep(next);
  }

  function open(selected: Invitation) {
    setInvitation(selected);
    setAnswers(answersFor(selected));
    setFirstDanceSong(selected.firstDanceSong);
    setFirstDanceArtist(selected.firstDanceArtist);
    setDietary(selected.dietary);
    setEmail("");
    setNotes("");
    goTo("form");
  }

  function search(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await lookupInvitation(name);
      if ("error" in result) return setError(result.error);
      setMatches(result.invitations);
      if (result.invitations.length === 1) open(result.invitations[0]);
      else goTo("choose");
    });
  }

  function update(guestId: number, change: Partial<Answer>) {
    setAnswers((current) => ({ ...current, [guestId]: { ...current[guestId], ...change } }));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!invitation) return;
    const missing = invitation.guests.find((guest) => answers[guest.id].attending === null);
    if (missing) {
      return setError(`Please let us know whether ${missing.name || "your guest"} will be attending.`);
    }
    setError("");
    startTransition(async () => {
      const result = await submitRsvp({
        partyId: invitation.id,
        guests: invitation.guests.map((guest) => ({
          id: guest.id,
          attending: answers[guest.id].attending === true,
          name: answers[guest.id].name,
        })),
        email,
        firstDanceSong,
        firstDanceArtist,
        dietary,
        notes,
      });
      if ("error" in result) return setError(result.error);
      setInvitation(result.invitation);
      setAnswers(answersFor(result.invitation));
      goTo("done");
    });
  }

  function startOver() {
    setName("");
    setMatches([]);
    setInvitation(null);
    goTo("search");
  }

  const errorMessage = (
    <p className="rsvp-message rsvp-message--error" role="alert">
      {error}
    </p>
  );

  if (step === "search") {
    return (
      <form className="rsvp-step" onSubmit={search}>
        <h2 className="rsvp-step-title" ref={headingRef} tabIndex={-1}>
          Find your invitation
        </h2>
        <p className="rsvp-lede">{rsvpCopy.intro}</p>
        <div className="rsvp-search">
          <div className="rsvp-field">
            <label htmlFor="rsvp-name">First and last name</label>
            <input
              id="rsvp-name"
              type="text"
              autoComplete="name"
              placeholder="Jane Smith"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={pending}>
            {pending ? "Searching…" : "Find my invitation"}
          </button>
        </div>
        {error && errorMessage}
      </form>
    );
  }

  if (step === "choose") {
    return (
      <div className="rsvp-step">
        <h2 className="rsvp-step-title" ref={headingRef} tabIndex={-1}>
          Which invitation is yours?
        </h2>
        <p className="rsvp-lede">We found more than one invitation for that name.</p>
        <ul className="rsvp-matches">
          {matches.map((match) => (
            <li key={match.id}>
              <button type="button" className="rsvp-match" onClick={() => open(match)}>
                {partyNames(match)}
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className="rsvp-link" onClick={startOver}>
          Search for a different name
        </button>
      </div>
    );
  }

  if (!invitation) return null;
  const anyoneAttending = invitation.guests.some((guest) => answers[guest.id].attending);

  if (step === "done") {
    return (
      <div className="rsvp-step">
        <h2 className="rsvp-step-title" ref={headingRef} tabIndex={-1}>
          {anyoneAttending ? "See you there!" : "Thank you"}
        </h2>
        <p className="rsvp-lede">
          {anyoneAttending ? rsvpCopy.thanksAttending : rsvpCopy.thanksDeclined}
        </p>
        {[invitation.firstDanceSong, invitation.firstDanceArtist].some(Boolean) && (
          <p className="rsvp-lede">
            First dance song:{" "}
            {[invitation.firstDanceSong, invitation.firstDanceArtist].filter(Boolean).join(" — ")}
          </p>
        )}
        <ul className="rsvp-summary">
          {invitation.guests.map((guest) => (
            <li key={guest.id}>
              <span className="rsvp-summary-name">{guest.name || "Guest"}</span>
              <span>
                {guest.attending ? "Attending" : "Not attending"}
              </span>
            </li>
          ))}
        </ul>
        <div className="rsvp-actions">
          <button type="button" className="btn btn-outline" onClick={() => open(invitation)}>
            Change my response
          </button>
          <button type="button" className="rsvp-link" onClick={startOver}>
            RSVP for someone else
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="rsvp-step" onSubmit={submit}>
      <h2 className="rsvp-step-title" ref={headingRef} tabIndex={-1}>
        Your invitation
      </h2>
      <p className="rsvp-lede">
        {invitation.respondedAt
          ? `You RSVP'd on ${respondedOn(invitation.respondedAt)}. You can update your answers below.`
          : "Please let us know who will be joining us."}
      </p>

      {invitation.guests.map((guest) => {
        const answer = answers[guest.id];
        const id = `guest-${guest.id}`;
        return (
          <fieldset className="rsvp-guest" key={guest.id}>
            <legend className="rsvp-guest-name">{guest.isPlusOne ? "Your guest" : guest.name}</legend>
            <div className="rsvp-choice" role="radiogroup" aria-label="Attendance">
              <label>
                <input
                  type="radio"
                  name={`${id}-attending`}
                  checked={answer.attending === true}
                  onChange={() => update(guest.id, { attending: true })}
                />
                <span>{guest.isPlusOne ? "Will attend" : "Joyfully accepts"}</span>
              </label>
              <label>
                <input
                  type="radio"
                  name={`${id}-attending`}
                  checked={answer.attending === false}
                  onChange={() => update(guest.id, { attending: false })}
                />
                <span>{guest.isPlusOne ? "Won't attend" : "Regretfully declines"}</span>
              </label>
            </div>
            {answer.attending && guest.isPlusOne && (
              <div className="rsvp-field">
                <label htmlFor={`${id}-name`}>Guest&rsquo;s full name</label>
                <input
                  id={`${id}-name`}
                  type="text"
                  value={answer.name}
                  onChange={(event) => update(guest.id, { name: event.target.value })}
                  required
                />
              </div>
            )}
          </fieldset>
        );
      })}

      <div className="rsvp-extras">
        {anyoneAttending && (
          <>
            <div className="rsvp-field">
              <label htmlFor="rsvp-dietary">Allergies or dietary restrictions</label>
              <textarea
                id="rsvp-dietary"
                value={dietary}
                onChange={(event) => setDietary(event.target.value)}
                placeholder="Let us know about any allergies or dietary needs in your party."
              />
            </div>
            {invitation.offerFirstDance && (
              <>
                <div className="rsvp-grid">
                  <div className="rsvp-field">
                    <label htmlFor="rsvp-song-name">Song name</label>
                    <input
                      id="rsvp-song-name"
                      type="text"
                      value={firstDanceSong}
                      onChange={(event) => setFirstDanceSong(event.target.value)}
                      placeholder="At Last"
                    />
                  </div>
                  <div className="rsvp-field">
                    <label htmlFor="rsvp-artist">Artist name</label>
                    <input
                      id="rsvp-artist"
                      type="text"
                      value={firstDanceArtist}
                      onChange={(event) => setFirstDanceArtist(event.target.value)}
                      placeholder="Etta James"
                    />
                  </div>
                </div>
                <p className="rsvp-hint">
                  Optional. We may play it during cocktail hour, or as a slow dance later in the
                  night.
                </p>
              </>
            )}
          </>
        )}
        <div className="rsvp-field">
          <label htmlFor="rsvp-email">Email</label>
          <input
            id="rsvp-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="jane@example.com"
            required={!invitation.respondedAt}
          />
          <p className="rsvp-hint">
            {invitation.respondedAt
              ? "Leave blank to keep the email you gave us before."
              : "So we can send you any updates about the day."}
          </p>
        </div>
        <div className="rsvp-field">
          <label htmlFor="rsvp-notes">{anyoneAttending ? "Notes for us" : "Leave us a note"}</label>
          <textarea
            id="rsvp-notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder={
              anyoneAttending ? "Anything else we should know?" : "We will miss you! Feel free to leave us a note."
            }
          />
        </div>
      </div>

      {error && errorMessage}
      <div className="rsvp-actions">
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? "Sending…" : "Send RSVP"}
        </button>
        <button type="button" className="rsvp-link" onClick={startOver}>
          Not you? Search again
        </button>
      </div>
    </form>
  );
}
