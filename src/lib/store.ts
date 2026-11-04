import "server-only";
import { Redis } from "@upstash/redis";
import { randomBytes } from "node:crypto";

export type Session = {
  id: string;
  title: string;
  createdAt: number;
  open: boolean;
};

export type FeedbackResponse = {
  rating: number; // 1..5
  liked: string;
  improve: string;
  createdAt: number;
};

export type SessionSummary = Session & {
  count: number;
  average: number | null;
};

/* ------------------------------------------------------------------ */
/* Backend: Upstash Redis on Vercel, in-memory fallback for local dev  */
/* ------------------------------------------------------------------ */

const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token =
  process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = url && token ? new Redis({ url, token }) : null;

export const usingMemoryStore = !redis;

type Memory = {
  sessions: Map<string, Session>;
  responses: Map<string, FeedbackResponse[]>;
};
const g = globalThis as unknown as { __feedbackMemory?: Memory };
const mem: Memory = (g.__feedbackMemory ??= {
  sessions: new Map(),
  responses: new Map(),
});

const K = {
  index: "fb:sessions",
  session: (id: string) => `fb:session:${id}`,
  responses: (id: string) => `fb:responses:${id}`,
};

function newId() {
  // 8 URL-safe chars, ~48 bits: short enough to type, hard to guess
  return randomBytes(6).toString("base64url");
}

/* ------------------------------------------------------------------ */

export async function createSession(title: string): Promise<Session> {
  const session: Session = {
    id: newId(),
    title,
    createdAt: Date.now(),
    open: true,
  };
  if (redis) {
    await redis
      .pipeline()
      .set(K.session(session.id), session)
      .zadd(K.index, { score: session.createdAt, member: session.id })
      .exec();
  } else {
    mem.sessions.set(session.id, session);
  }
  return session;
}

export async function getSession(id: string): Promise<Session | null> {
  if (redis) return (await redis.get<Session>(K.session(id))) ?? null;
  return mem.sessions.get(id) ?? null;
}

export async function setSessionOpen(id: string, open: boolean) {
  const s = await getSession(id);
  if (!s) return;
  const next = { ...s, open };
  if (redis) await redis.set(K.session(id), next);
  else mem.sessions.set(id, next);
}

export async function deleteSession(id: string) {
  if (redis) {
    await redis
      .pipeline()
      .del(K.session(id))
      .del(K.responses(id))
      .zrem(K.index, id)
      .exec();
  } else {
    mem.sessions.delete(id);
    mem.responses.delete(id);
  }
}

export async function addResponse(id: string, r: FeedbackResponse) {
  if (redis) await redis.rpush(K.responses(id), r);
  else mem.responses.set(id, [...(mem.responses.get(id) ?? []), r]);
}

export async function getResponses(id: string): Promise<FeedbackResponse[]> {
  if (redis)
    return await redis.lrange<FeedbackResponse>(K.responses(id), 0, -1);
  return mem.responses.get(id) ?? [];
}

export async function listSessions(): Promise<SessionSummary[]> {
  let sessions: Session[];
  if (redis) {
    const ids = await redis.zrange<string[]>(K.index, 0, -1, { rev: true });
    if (ids.length === 0) return [];
    const got = await redis.mget<(Session | null)[]>(...ids.map(K.session));
    sessions = got.filter((s): s is Session => !!s);
  } else {
    sessions = [...mem.sessions.values()].sort(
      (a, b) => b.createdAt - a.createdAt,
    );
  }

  const all = await Promise.all(sessions.map((s) => getResponses(s.id)));
  return sessions.map((s, i) => {
    const rs = all[i];
    return {
      ...s,
      count: rs.length,
      average: rs.length
        ? rs.reduce((sum, r) => sum + r.rating, 0) / rs.length
        : null,
    };
  });
}
