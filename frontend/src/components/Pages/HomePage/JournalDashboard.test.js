import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import JournalDashboard from "./JournalDashboard";

const place = {
  id: 10, name: "Rome", location: "Italy", img1: "",
  bookings: { 20: { id: 20, startDate: "2020-01-01", endDate: "2020-01-02" } },
  reviews: { 30: { id: 30, review: "Wonderful", rating: 5 } },
};
const collection = { id: 40, name: "Favorites", wishspots: { 50: { id: 50, spotId: 10, wishlistId: 40 } } };

beforeEach(() => {
  window.scrollTo = jest.fn();
  window.prompt = jest.fn();
  global.fetch = jest.fn((url, options = {}) => {
    if (url === "/api/spots/" && !options.method) return Promise.resolve({ ok: true, json: async () => ({ spots: [place] }) });
    if (url === "/api/wishlists/" && !options.method) return Promise.resolve({ ok: true, json: async () => ({ wishlists: [collection] }) });
    return Promise.resolve({ ok: true, json: async () => ({ id: 1 }) });
  });
});

afterEach(() => jest.restoreAllMocks());

const called = (path, method, body) => waitFor(() => expect(fetch).toHaveBeenCalledWith(path, expect.objectContaining({
  method, body: JSON.stringify(body), headers: expect.objectContaining({ "X-CSRFToken": expect.any(String) }),
})));

test("creates and edits a Place, then visibly reloads the journal", async () => {
  render(<JournalDashboard />);
  await screen.findByRole("heading", { name: "Rome" });
  fireEvent.change(screen.getByLabelText("Place name"), { target: { value: "Lisbon" } });
  fireEvent.change(screen.getByLabelText("Place location"), { target: { value: "Portugal" } });
  fireEvent.change(screen.getByLabelText("Photo URL"), { target: { value: "https://example.com/lisbon.jpg" } });
  fireEvent.click(screen.getByText("Add Place"));
  await called("/api/spots/create", "POST", { name: "Lisbon", location: "Portugal", img1: "https://example.com/lisbon.jpg" });
  fireEvent.click(screen.getByText("Edit Place"));
  fireEvent.change(screen.getByLabelText("Place name"), { target: { value: "Roma" } });
  fireEvent.click(screen.getByText("Save Place"));
  await called("/api/spots/10", "PUT", { name: "Roma", location: "Italy", img1: "" });
  expect(await screen.findByRole("heading", { name: "Rome" })).toBeTruthy();
});

test("sends Stay and Memory create, edit, and delete requests", async () => {
  render(<JournalDashboard />);
  await screen.findByText("2020-01-01 – 2020-01-02");

  window.prompt.mockReturnValueOnce("2021-01-01").mockReturnValueOnce("2021-01-03");
  fireEvent.click(screen.getByText("Add Stay"));
  await called("/api/bookings/create", "POST", { spotId: 10, startDate: "2021-01-01", endDate: "2021-01-03" });
  window.prompt.mockReturnValueOnce("2022-01-01").mockReturnValueOnce("2022-01-02");
  const stayRow = screen.getByText("2020-01-01 – 2020-01-02").parentElement;
  fireEvent.click(within(stayRow).getByText("Edit"));
  await called("/api/bookings/update", "PUT", { id: 20, startDate: "2022-01-01", endDate: "2022-01-02" });
  fireEvent.click(within(stayRow).getByText("Delete"));
  await called("/api/bookings/delete", "DELETE", { id: 20 });

  window.prompt.mockReturnValueOnce("A new memory").mockReturnValueOnce("4");
  fireEvent.click(screen.getByText("Add Memory"));
  await called("/api/reviews/create", "POST", { spotId: 10, review: "A new memory", rating: 4 });
  window.prompt.mockReturnValueOnce("Still wonderful").mockReturnValueOnce("3");
  const memory = screen.getByText("Wonderful · 5/5").parentElement;
  fireEvent.click(within(memory).getByText("Edit"));
  await called("/api/reviews/update", "PUT", { id: 30, review: "Still wonderful", rating: 3 });
  fireEvent.click(within(memory).getByText("Delete"));
  await called("/api/reviews/delete", "DELETE", { id: 30 });
  expect(await screen.findByText("Wonderful · 5/5")).toBeTruthy();
});

test("creates, edits, deletes, and changes Collection membership", async () => {
  render(<JournalDashboard />);
  await screen.findByText("Favorites");
  fireEvent.change(screen.getByLabelText("Collection name"), { target: { value: "Dream trips" } });
  fireEvent.click(screen.getByText("Add Collection"));
  await called("/api/wishlists/create", "POST", { name: "Dream trips" });
  window.prompt.mockReturnValueOnce("Italy favorites");
  fireEvent.click(screen.getByText("Edit Collection"));
  await called("/api/wishlists/update", "PUT", { id: 40, name: "Italy favorites" });
  fireEvent.click(screen.getByRole("checkbox"));
  await called("/api/wishspots/delete", "DELETE", { wishlistId: 40, spotId: 10 });
  fireEvent.click(screen.getByText("Delete Collection"));
  await called("/api/wishlists/delete", "DELETE", { id: 40 });
  expect(await screen.findByText("Favorites")).toBeTruthy();
});
