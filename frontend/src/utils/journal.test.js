import { placeStatus, timelineFor } from "./journal";

const place = (name, bookings) => ({ id: name, name, location: "Somewhere", bookings, reviews: {} });

test("classifies Places from their Stay dates", () => {
  expect(placeStatus(place("Kyoto", {}), "2026-08-14")).toBe("Unscheduled");
  expect(placeStatus(place("Lisbon", { 1: { startDate: "2025-01-01", endDate: "2025-01-04" } }), "2026-08-14")).toBe("Visited");
  expect(placeStatus(place("Banff", { 1: { startDate: "2026-09-01", endDate: "2026-09-04" } }), "2026-08-14")).toBe("Planned");
  expect(placeStatus(place("Today", { 1: { startDate: "2026-08-10", endDate: "2026-08-14" } }), "2026-08-14")).toBe("Planned");
});

test("builds a newest-first travel timeline with its Place", () => {
  const items = timelineFor([
    place("Kyoto", { 1: { id: 1, startDate: "2025-04-01", endDate: "2025-04-04" } }),
    place("Banff", { 2: { id: 2, startDate: "2026-09-01", endDate: "2026-09-04" } }),
  ]);

  expect(items.map(item => [item.place.name, item.startDate])).toEqual([
    ["Banff", "2026-09-01"], ["Kyoto", "2025-04-01"],
  ]);
});
