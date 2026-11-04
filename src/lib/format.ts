// Fixed locale + timezone so server (UTC on Vercel) and browser render identically.
const TZ = "Africa/Casablanca";

export const fmtDate = (t: number) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TZ,
  }).format(t);

export const fmtLongDate = (t: number) =>
  new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TZ,
  }).format(t);

export const fmtTime = (t: number) =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TZ,
  }).format(t);
