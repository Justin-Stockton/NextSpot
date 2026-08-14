import React from "react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { render, screen } from "@testing-library/react";
import LoginModal from "./LoginModal";

const store = {
  getState: () => ({ session: { user: null } }),
  subscribe: () => () => {},
  dispatch: jest.fn(),
};

test("keeps empty login labels positioned inside their fields on mobile", () => {
  render(
    <Provider store={store}>
      <Router history={createMemoryHistory()}>
        <LoginModal />
      </Router>
    </Provider>
  );

  expect(screen.getByText("Email").className).toContain("absolute left-4 top-2");
  expect(screen.getByText("Password").className).toContain("absolute left-4 top-2");
});
