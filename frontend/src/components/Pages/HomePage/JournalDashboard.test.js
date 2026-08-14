import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import JournalDashboard from "./JournalDashboard";

const originalPlace = {
  id: 10, name: "Rome", location: "Italy", img1: "",
  bookings: { 20: { id: 20, startDate: "2020-01-01", endDate: "2020-01-02" } },
  reviews: { 30: { id: 30, review: "Wonderful", rating: 5 } },
};
const originalCollection = { id: 40, name: "Favorites", wishspots: {} };

let places;
let collections;

const response = data => Promise.resolve({ ok: true, json: async () => data });

beforeEach(() => {
  window.scrollTo = jest.fn();
  window.prompt = jest.fn();
  places = [JSON.parse(JSON.stringify(originalPlace))];
  collections = [JSON.parse(JSON.stringify(originalCollection))];
  global.fetch = jest.fn((url, options = {}) => {
    const body = options.body && JSON.parse(options.body);
    if (url === "/api/spots/" && !options.method) return response({ spots: JSON.parse(JSON.stringify(places)) });
    if (url === "/api/wishlists/" && !options.method) return response({ wishlists: JSON.parse(JSON.stringify(collections)) });
    if (url === "/api/spots/create") places.push({ id: 11, ...body, bookings: {}, reviews: {} });
    if (url === "/api/spots/10" && options.method === "PUT") places[0] = { ...places[0], ...body };
    if (url === "/api/spots/10" && options.method === "DELETE") places = [];
    if (url === "/api/bookings/update") places[0].bookings[20] = { ...places[0].bookings[20], ...body };
    if (url === "/api/bookings/delete") delete places[0].bookings[body.id];
    if (url === "/api/reviews/update") places[0].reviews[30] = { ...places[0].reviews[30], ...body };
    if (url === "/api/reviews/delete") delete places[0].reviews[body.id];
    if (url === "/api/wishlists/create") collections.push({ id: 41, ...body, wishspots: {} });
    if (url === "/api/wishlists/update") collections[0].name = body.name;
    if (url === "/api/wishlists/delete") collections = collections.filter(item => item.id !== body.id);
    if (url === "/api/wishspots/create") collections[0].wishspots = { 50: { id: 50, ...body } };
    if (url === "/api/wishspots/delete") collections[0].wishspots = {};
    return response({ id: 1, ...body });
  });
});

afterEach(() => jest.restoreAllMocks());

const called = (path, method, body) => waitFor(() => expect(fetch).toHaveBeenCalledWith(path, expect.objectContaining({
  method, body: JSON.stringify(body), headers: expect.objectContaining({ "X-CSRFToken": expect.any(String) }),
})));

test("creates, updates, and deletes a Place with visible reloads", async () => {
  render(<JournalDashboard />);
  await screen.findByRole("heading", { name: "Rome" });
  fireEvent.change(screen.getByLabelText("Place name"), { target: { value: "Lisbon" } });
  fireEvent.change(screen.getByLabelText("Place location"), { target: { value: "Portugal" } });
  fireEvent.change(screen.getByLabelText("Photo URL"), { target: { value: "https://example.com/lisbon.jpg" } });
  fireEvent.click(screen.getByText("Add Place"));
  await called("/api/spots/create", "POST", { name: "Lisbon", location: "Portugal", img1: "https://example.com/lisbon.jpg" });
  expect(await screen.findByRole("heading", { name: "Lisbon" })).toBeTruthy();

  fireEvent.click(screen.getAllByText("Edit Place")[0]);
  fireEvent.change(screen.getByLabelText("Place name"), { target: { value: "Roma" } });
  fireEvent.click(screen.getByText("Save Place"));
  await called("/api/spots/10", "PUT", { name: "Roma", location: "Italy", img1: "" });
  expect(await screen.findByRole("heading", { name: "Roma" })).toBeTruthy();

  fireEvent.click(screen.getAllByText("Delete Place")[0]);
  await called("/api/spots/10", "DELETE", {});
  await waitFor(() => expect(screen.queryByRole("heading", { name: "Roma" })).toBeNull());
});

test("uses ISO Stay edit defaults and visibly reloads Stay and Memory changes", async () => {
  render(<JournalDashboard />);
  await screen.findByText("2020-01-01 – 2020-01-02");

  window.prompt.mockReturnValueOnce("2021-01-01").mockReturnValueOnce("2021-01-03");
  fireEvent.click(screen.getByText("Add Stay"));
  await called("/api/bookings/create", "POST", { spotId: 10, startDate: "2021-01-01", endDate: "2021-01-03" });

  window.prompt.mockReturnValueOnce("2022-01-01").mockReturnValueOnce("2022-01-02");
  fireEvent.click(within(screen.getByText("2020-01-01 – 2020-01-02").parentElement).getByText("Edit"));
  expect(window.prompt).toHaveBeenNthCalledWith(3, "Arrival date (YYYY-MM-DD)", "2020-01-01");
  expect(window.prompt).toHaveBeenNthCalledWith(4, "Departure date (YYYY-MM-DD)", "2020-01-02");
  await called("/api/bookings/update", "PUT", { id: 20, startDate: "2022-01-01", endDate: "2022-01-02" });
  const updatedStay = await screen.findByText("2022-01-01 – 2022-01-02");
  fireEvent.click(within(updatedStay.parentElement).getByText("Delete"));
  await called("/api/bookings/delete", "DELETE", { id: 20 });
  await waitFor(() => expect(screen.queryByText("2022-01-01 – 2022-01-02")).toBeNull());

  window.prompt.mockReturnValueOnce("A new memory").mockReturnValueOnce("4");
  fireEvent.click(screen.getByText("Add Memory"));
  await called("/api/reviews/create", "POST", { spotId: 10, review: "A new memory", rating: 4 });
  window.prompt.mockReturnValueOnce("Still wonderful").mockReturnValueOnce("3");
  fireEvent.click(within(screen.getByText("Wonderful · 5/5").parentElement).getByText("Edit"));
  await called("/api/reviews/update", "PUT", { id: 30, review: "Still wonderful", rating: 3 });
  const updatedMemory = await screen.findByText("Still wonderful · 3/5");
  fireEvent.click(within(updatedMemory.parentElement).getByText("Delete"));
  await called("/api/reviews/delete", "DELETE", { id: 30 });
  await waitFor(() => expect(screen.queryByText("Still wonderful · 3/5")).toBeNull());
});

test("reloads checked state after membership add and unchecked state after remove", async () => {
  render(<JournalDashboard />);
  await screen.findByText("Favorites");
  const checkbox = screen.getByRole("checkbox");
  expect(checkbox.checked).toBe(false);

  fireEvent.click(checkbox);
  await called("/api/wishspots/create", "POST", { wishlistId: 40, spotId: 10 });
  await waitFor(() => expect(screen.getByRole("checkbox").checked).toBe(true));

  fireEvent.click(screen.getByRole("checkbox"));
  await called("/api/wishspots/delete", "DELETE", { wishlistId: 40, spotId: 10 });
  await waitFor(() => expect(screen.getByRole("checkbox").checked).toBe(false));

  window.prompt.mockReturnValueOnce("Italy favorites");
  fireEvent.click(screen.getByText("Edit Collection"));
  await called("/api/wishlists/update", "PUT", { id: 40, name: "Italy favorites" });
  expect(await screen.findByText("Italy favorites")).toBeTruthy();
  fireEvent.click(screen.getByText("Delete Collection"));
  await called("/api/wishlists/delete", "DELETE", { id: 40 });
  await waitFor(() => expect(screen.queryByText("Italy favorites")).toBeNull());
});
