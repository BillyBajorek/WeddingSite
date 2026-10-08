"use server";

import { refresh } from "next/cache";
import { isAdmin, signIn, signOut } from "@/lib/admin";
import { DatabaseNotConfiguredError } from "@/lib/db";
import { deleteParty, importGuestList, type ImportResult } from "@/lib/guests";

export type LoginState = { error?: string };
export type ImportState = { result?: ImportResult; error?: string };

export async function login(_: LoginState, formData: FormData): Promise<LoginState> {
  const ok = await signIn(String(formData.get("password") ?? ""));
  return ok ? {} : { error: "That password isn't right." };
}

export async function logout() {
  await signOut();
}

export async function importGuests(_: ImportState, formData: FormData): Promise<ImportState> {
  if (!(await isAdmin())) return { error: "Please sign in again." };
  const text = String(formData.get("guests") ?? "").slice(0, 200_000);
  try {
    const result = await importGuestList(text);
    refresh();
    return { result };
  } catch (error) {
    if (error instanceof DatabaseNotConfiguredError) {
      return { error: "Add a database first (see the note at the top of this page)." };
    }
    console.error(error);
    return { error: "Import failed. Nothing was added." };
  }
}

export async function removeParty(formData: FormData) {
  if (!(await isAdmin())) return;
  const partyId = Number(formData.get("partyId"));
  if (!Number.isInteger(partyId)) return;
  await deleteParty(partyId);
  refresh();
}
