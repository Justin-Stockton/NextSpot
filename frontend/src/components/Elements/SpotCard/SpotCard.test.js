import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import SpotCard from "./SpotCard";

jest.mock("react-redux", () => ({
  useSelector: (selector) => selector({ session: { user: null }, wishlists: {} }),
}));
jest.mock("react-router-dom", () => ({ useHistory: () => ({ push: jest.fn() }) }));
jest.mock("../Modal/Modal", () => () => null);
jest.mock("../../../App", () => ({ useClickOutside: () => ({ current: null }) }));

const spot = {
  id: 1,
  city: "Atlanta",
  state: "Georgia",
  price: 100,
  reviews: {},
  img1: "one.jpg",
  img2: "two.jpg",
  img3: "three.jpg",
  img4: "four.jpg",
  img5: "five.jpg",
};

test("cycles preview images with accessible controls", () => {
  render(<SpotCard spot={spot} />);

  const preview = screen.getByAltText("Spot");
  fireEvent.click(screen.getByRole("button", { name: "Next image" }));
  expect(preview.getAttribute("src")).toBe("two.jpg");

  fireEvent.click(screen.getByRole("button", { name: "Previous image" }));
  expect(preview.getAttribute("src")).toBe("one.jpg");
});
