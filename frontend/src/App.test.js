import React from "react";
import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import App from "./App";

function storeWith(user) {
  const store = {
    getState: () => ({ session: { user } }),
    subscribe: () => () => {},
    dispatch: action => typeof action === "function" ? action(store.dispatch, store.getState) : action,
  };
  return store;
}

afterEach(() => jest.restoreAllMocks());

test("redirects an anonymous protected route to login", async () => {
  window.history.pushState({}, "", "/places");
  global.fetch = jest.fn(() => Promise.resolve({ ok: false }));
  render(<Provider store={storeWith(null)}><App /></Provider>);
  expect(await screen.findByText("Welcome to NextSpot")).toBeTruthy();
});

test("routes an authenticated user to Account", async () => {
  const user = { username: "Traveler", email: "traveler@example.com" };
  window.history.pushState({}, "", "/account");
  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: async () => user }));
  render(<Provider store={storeWith(user)}><App /></Provider>);
  expect(await screen.findByRole("heading", { name: "Your profile" })).toBeTruthy();
  expect(screen.getByText("traveler@example.com")).toBeTruthy();
});
