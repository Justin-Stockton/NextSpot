import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import JournalDashboard from "./JournalDashboard";

let places;
let collections;
const response = data => Promise.resolve({ ok: true, json: async () => data });

beforeEach(() => {
  places = [
    { id: 1, name: "Kyoto", location: "Japan", img1: "", bookings: { 1: { id: 1, startDate: "2020-04-01", endDate: "2020-04-05" } }, reviews: { 1: { id: 1, rating: 5 } } },
    { id: 2, name: "Banff", location: "Canada", img1: "", bookings: { 2: { id: 2, startDate: "2099-08-01", endDate: "2099-08-05" } }, reviews: {} },
    { id: 3, name: "Reykjavik", location: "Iceland", img1: "", bookings: {}, reviews: {} },
  ];
  collections = [{ id: 4, name: "Favorites", wishspots: {} }];
  global.fetch = jest.fn((url, options = {}) => {
    const body = options.body && JSON.parse(options.body);
    if (url === "/api/spots/" && !options.method) return response({ spots: JSON.parse(JSON.stringify(places)) });
    if (url === "/api/wishlists/" && !options.method) return response({ wishlists: JSON.parse(JSON.stringify(collections)) });
    if (url === "/api/spots/create") places.push({ id: 5, ...body, bookings: {}, reviews: {} });
    if (url === "/api/wishspots/create") collections[0].wishspots = { 1: { id: 1, ...body } };
    if (url === "/api/wishspots/delete") collections[0].wishspots = {};
    return response({ id: 5, ...body });
  });
});
afterEach(() => jest.restoreAllMocks());

const renderPage = view => render(<MemoryRouter><JournalDashboard view={view} /></MemoryRouter>);

test("shows Visited, Planned, and Unscheduled Places on the dashboard", async () => {
  renderPage("dashboard");
  expect(await screen.findByRole("heading", { name: "Next adventures" })).toBeTruthy();
  expect(screen.getByRole("heading", { name: "Banff" })).toBeTruthy();
  expect(screen.getByRole("heading", { name: "Recently visited" })).toBeTruthy();
  expect(screen.getByRole("heading", { name: "Kyoto" })).toBeTruthy();
  expect(screen.getByLabelText("Journal summary").textContent).toContain("Unscheduled1");
});

test("uses a real Place form and visibly adds the Place", async () => {
  renderPage("places");
  await screen.findByRole("heading", { name: "Kyoto" });
  fireEvent.click(screen.getByRole("button", { name: "Add Place" }));
  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Lisbon" } });
  fireEvent.change(screen.getByLabelText("Location"), { target: { value: "Portugal" } });
  fireEvent.change(screen.getByLabelText("Photo URL 1"), { target: { value: "https://example.com/lisbon.jpg" } });
  fireEvent.click(screen.getByRole("button", { name: "Save Place" }));

  await waitFor(() => expect(fetch).toHaveBeenCalledWith("/api/spots/create", expect.objectContaining({ method: "POST" })));
  expect(await screen.findByRole("heading", { name: "Lisbon" })).toBeTruthy();
});

test("manages Collection membership without browser prompts", async () => {
  window.prompt = jest.fn();
  renderPage("collections");
  await screen.findByRole("heading", { name: "Favorites" });
  const kyoto = screen.getByLabelText("Kyoto");
  fireEvent.click(kyoto);
  await waitFor(() => expect(kyoto.checked).toBe(true));
  expect(fetch).toHaveBeenCalledWith("/api/wishspots/create", expect.objectContaining({ method: "POST", body: JSON.stringify({ wishlistId: 4, spotId: 1 }) }));
  expect(window.prompt).not.toHaveBeenCalled();
});
