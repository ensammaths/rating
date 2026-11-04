import { getResponses, getSession } from "@/lib/store";

const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;

export async function GET(
  _req: Request,
  ctx: RouteContext<"/results/[id]/csv">,
) {
  const { id } = await ctx.params;
  const session = await getSession(id);
  if (!session) return new Response("Not found", { status: 404 });

  const rows = (await getResponses(id)).map((r) =>
    [new Date(r.createdAt).toISOString(), r.rating, r.liked, r.improve]
      .map(esc)
      .join(","),
  );
  const csv = ["submitted_at,rating,liked,improve", ...rows].join("\n");
  const name =
    session.title
      .replace(/[^\w\- ]+/g, "")
      .trim()
      .replace(/\s+/g, "-") || id;

  return new Response("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${name}-feedback.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
