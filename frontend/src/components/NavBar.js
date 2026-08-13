import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import LoginPopup from "./Elements/LoginPopup";
import ProfilePopup from "./Elements/ProfilePopup";
import { useClickOutside } from "../App.js";
const NavBar = () => {
  const history = useHistory();
  const user = useSelector((state) => state.session.user);
  const [display, setDisplay] = useState(false);

  const popupRef = useClickOutside(() => {
    setDisplay(false);
  });
  return (
    <div>
      <div className={'relative mb-6 flex min-h-[72px] items-center justify-between border-b border-gray-200 px-4 sm:px-8 lg:px-[8%]'}>
        <img
          className={'h-16 w-24 cursor-pointer object-contain'}
          src="/media/1.svg"
          alt="Next Spot Logo"
          onClick={() => history.push("/")}
        />
        {!user ? (
          <>
            <div
              className={'flex h-11 cursor-pointer items-center rounded-full border border-gray-300 bg-white px-4 font-semibold shadow-sm transition hover:shadow-md'}
              onClick={() => {
                setDisplay(!display);
              }}
            >
              <img
                alt="menu"
                className={'mr-2 h-4 w-4'}
                src="/media/hamburger.svg"
              />{" "}
              Login
            </div>
            <LoginPopup
              innerRef={popupRef}
              setDisplay={setDisplay}
              display={display}
            />
          </>
        ) : (
          <>
            <div
              className={'flex h-11 cursor-pointer items-center rounded-full border border-gray-300 bg-white px-4 font-semibold shadow-sm transition hover:shadow-md'}
              onClick={() => {
                setDisplay(!display);
              }}
            >
              <img
                alt="menu"
                className={'mr-2 h-4 w-4'}
                src="/media/hamburger.svg"
              />{" "}
              {user.username}
            </div>
            <ProfilePopup
              setDisplay={setDisplay}
              innerRef={popupRef}
              display={display}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
