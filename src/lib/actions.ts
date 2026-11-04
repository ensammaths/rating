"use server";

import { revalidatePath } from "next/cache";
import {
  addResponse,
  createSession,
  deleteSession,
  getSession,
  setSessionOpen,
} from "./store";

const MAX_TEXT = 2000;

const clean = (v: FormDataEntryValue | null, max = MAX_TEXT) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export type SubmitState = { ok: boolean; error?: string };

export async function submitFeedback(
  sessionId: string,
  input: { rating: number; liked: string; improve: string },
): Promise<SubmitState> {
  const session = await getSession(sessionId);
  if (!session)
    return { ok: false, error: "This feedback link doesn't exist." };
  if (!session.open)
    return {
      ok: false,
      error: "This session is no longer accepting feedback.",
    };

  const rating = Math.round(Number(input.rating));
  if (!(rating >= 1 && rating <= 5))
    return { ok: false, error: "Please pick a rating." };

  await addResponse(sessionId, {
    rating,
    liked: String(input.liked ?? "")
      .trim()
      .slice(0, MAX_TEXT),
    improve: String(input.improve ?? "")
      .trim()
      .slice(0, MAX_TEXT),
    createdAt: Date.now(),
  });
  return { ok: true };
}

export async function createSessionAction(formData: FormData) {
  const title = clean(formData.get("title"), 120);
  if (!title) return;
  await createSession(title);
  revalidatePath("/");
}

export async function toggleSessionAction(id: string, open: boolean) {
  await setSessionOpen(id, open);
  revalidatePath("/");
  revalidatePath(`/results/${id}`);
}

export async function deleteSessionAction(id: string) {
  await deleteSession(id);
  revalidatePath("/");
}
