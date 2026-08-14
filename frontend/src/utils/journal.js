import { jsonHeaders } from "./csrf";

export async function journalRequest(path, options = {}) {
  const response = await fetch(path, { headers: jsonHeaders(), ...options });
  let data;
  try { data = await response.json(); } catch { data = {}; }
  if (!response.ok) throw new Error((data.errors || [`Request failed (${response.status})`])[0]);
  return data;
}

export const staysFor = place => Object.values(place.bookings || {});
export const memoriesFor = place => Object.values(place.reviews || {});

export function todayISO(now = new Date()) {
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export function placeStatus(place, today = todayISO()) {
  const stays = staysFor(place);
  if (!stays.length) return "Unscheduled";
  return stays.some(stay => stay.endDate >= today) ? "Planned" : "Visited";
}

export function timelineFor(places) {
  return places.flatMap(place => staysFor(place).map(stay => ({ ...stay, place })))
    .sort((a, b) => b.startDate.localeCompare(a.startDate));
}

export function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${value}T00:00:00Z`));
}
