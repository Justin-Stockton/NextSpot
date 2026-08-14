import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";
import SpotPage from "./SpotPage";

let place;
const response = data => Promise.resolve({ ok: true, json: async () => data });

beforeEach(() => {
  place = {
    id: 1, name: "Kyoto", location: "Kyoto, Japan", city: "Kyoto", state: "Kyoto",
    img1: "https://example.com/1.jpg", img2: "https://example.com/2.jpg", img3: "", img4: "", img5: "", img6: "",
    bookings: {}, reviews: {},
  };
  global.fetch = jest.fn((url, options = {}) => {
    const body = options.body && JSON.parse(options.body);
    if (url === "/api/spots/1" && !options.method) return response(JSON.parse(JSON.stringify(place)));
    if (url === "/api/wishlists/" && !options.method) return response({ wishlists: [{ id: 8, name: "Favorites", wishspots: {} }] });
    if (url === "/api/bookings/create") place.bookings[10] = { id: 10, ...body };
    if (url === "/api/bookings/update") place.bookings[body.id] = { ...place.bookings[body.id], ...body };
    if (url === "/api/bookings/delete") delete place.bookings[body.id];
    if (url === "/api/reviews/create") place.reviews[11] = { id: 11, ...body, rating: Number(body.rating) };
    if (url === "/api/reviews/update") place.reviews[body.id] = { ...place.reviews[body.id], ...body };
    if (url === "/api/reviews/delete") delete place.reviews[body.id];
    return response({ id: 10, ...body });
  });
});
afterEach(() => jest.restoreAllMocks());

function renderPage() {
  return render(<MemoryRouter initialEntries={["/places/1"]}><Route path="/places/:placeId"><SpotPage /></Route></MemoryRouter>);
}

test("renders the Place gallery and complete journal sections", async () => {
  renderPage();
  expect(await screen.findByRole("heading", { name: "Kyoto" })).toBeTruthy();
  expect(screen.getByLabelText("Place photo gallery")).toBeTruthy();
  expect(screen.getByRole("heading", { name: "Stays" })).toBeTruthy();
  expect(screen.getByRole("heading", { name: "Memories" })).toBeTruthy();
  expect(screen.getByRole("heading", { name: "Collections" })).toBeTruthy();
});

test("swipes through Place photos on touch screens", async () => {
  renderPage();
  const gallery = await screen.findByLabelText("Place photo gallery");
  const photo = within(gallery).getByRole("button", { name: "Kyoto view 1" });

  fireEvent.touchStart(photo, { touches: [{ clientX: 250, clientY: 100 }] });
  fireEvent.touchEnd(photo, { changedTouches: [{ clientX: 50, clientY: 105 }] });
  expect(within(gallery).getByAltText("Kyoto view 2")).toBeTruthy();

  fireEvent.touchStart(photo, { touches: [{ clientX: 50, clientY: 100 }] });
  fireEvent.touchEnd(photo, { changedTouches: [{ clientX: 250, clientY: 105 }] });
  expect(within(gallery).getByAltText("Kyoto view 1")).toBeTruthy();
});

test("edits and deletes an existing Stay through the Place page", async () => {
  place.bookings[10] = { id: 10, spotId: 1, startDate: "2025-01-01", endDate: "2025-01-04" };
  window.confirm = jest.fn(() => true);
  renderPage();
  const stays = (await screen.findByRole("heading", { name: "Stays" })).closest("section");
  fireEvent.click(within(stays).getByRole("button", { name: "Edit" }));
  expect(screen.getByLabelText("Arrival").value).toBe("2025-01-01");
  fireEvent.change(screen.getByLabelText("Departure"), { target: { value: "2025-01-06" } });
  fireEvent.click(within(screen.getByLabelText("Arrival").closest("form")).getByRole("button", { name: "Save Stay" }));
  await waitFor(() => expect(fetch).toHaveBeenCalledWith("/api/bookings/update", expect.objectContaining({ method: "PUT", body: JSON.stringify({ id: 10, startDate: "2025-01-01", endDate: "2025-01-06" }) })));
  fireEvent.click(within(stays).getByRole("button", { name: "Delete" }));
  await waitFor(() => expect(fetch).toHaveBeenCalledWith("/api/bookings/delete", expect.objectContaining({ method: "DELETE", body: JSON.stringify({ id: 10 }) })));
});

test("adds a Stay and Memory through labeled forms without prompts", async () => {
  window.prompt = jest.fn();
  renderPage();
  await screen.findByRole("heading", { name: "Kyoto" });

  fireEvent.click(screen.getByRole("button", { name: "Add Stay" }));
  fireEvent.change(screen.getByLabelText("Arrival"), { target: { value: "2099-08-01" } });
  fireEvent.change(screen.getByLabelText("Departure"), { target: { value: "2099-08-05" } });
  const stayForm = screen.getByLabelText("Arrival").closest("form");
  const addStay = within(stayForm).getByRole("button", { name: "Add Stay" });
  fireEvent.click(addStay);
  fireEvent.click(addStay);
  await waitFor(() => expect(fetch).toHaveBeenCalledWith("/api/bookings/create", expect.objectContaining({ method: "POST", body: JSON.stringify({ spotId: 1, startDate: "2099-08-01", endDate: "2099-08-05" }) })));
  expect(fetch.mock.calls.filter(([url]) => url === "/api/bookings/create")).toHaveLength(1);

  fireEvent.click(screen.getByRole("button", { name: "Add Memory" }));
  fireEvent.change(screen.getByLabelText("Memory"), { target: { value: "Temple walk at sunrise" } });
  fireEvent.change(screen.getByLabelText("Rating"), { target: { value: "5" } });
  const memoryForm = screen.getByLabelText("Memory").closest("form");
  fireEvent.click(within(memoryForm).getByRole("button", { name: "Add Memory" }));
  await waitFor(() => expect(fetch).toHaveBeenCalledWith("/api/reviews/create", expect.objectContaining({ method: "POST", body: JSON.stringify({ spotId: 1, review: "Temple walk at sunrise", rating: 5 }) })));
  expect(window.prompt).not.toHaveBeenCalled();
});
