import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import JournalDashboard from "./JournalDashboard";

beforeEach(() => {
  window.scrollTo = jest.fn();
  global.fetch = jest.fn((url, options = {}) => {
    if (url === "/api/spots/" && !options.method) return Promise.resolve({ ok: true, json: async () => ({ spots: [] }) });
    if (url === "/api/wishlists/" && !options.method) return Promise.resolve({ ok: true, json: async () => ({ wishlists: [] }) });
    return Promise.resolve({ ok: true, json: async () => ({ id: 1 }) });
  });
});

afterEach(() => jest.restoreAllMocks());

test("creates a Place with a URL photo and reloads the journal", async () => {
  render(<JournalDashboard />);
  await screen.findByText("No Places yet. Add one above to begin.");
  fireEvent.change(screen.getByLabelText("Place name"), { target: { value: "Lisbon" } });
  fireEvent.change(screen.getByLabelText("Place location"), { target: { value: "Portugal" } });
  fireEvent.change(screen.getByLabelText("Photo URL"), { target: { value: "https://example.com/lisbon.jpg" } });
  fireEvent.click(screen.getByText("Add Place"));
  await waitFor(() => expect(fetch).toHaveBeenCalledWith("/api/spots/create", expect.objectContaining({
    method: "POST",
    body: JSON.stringify({ name: "Lisbon", location: "Portugal", img1: "https://example.com/lisbon.jpg" }),
  })));
});

test("creates a Collection", async () => {
  render(<JournalDashboard />);
  await screen.findByText("Collections");
  fireEvent.change(screen.getByLabelText("Collection name"), { target: { value: "Dream trips" } });
  fireEvent.click(screen.getByText("Add Collection"));
  await waitFor(() => expect(fetch).toHaveBeenCalledWith("/api/wishlists/create", expect.objectContaining({
    method: "POST", body: JSON.stringify({ name: "Dream trips" }),
  })));
});
