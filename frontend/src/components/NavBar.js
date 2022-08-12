import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import LoginPopup from "./Elements/LoginPopup";
import ProfilePopup from "./Elements/ProfilePopup";
import classes from "./Navbar.module.css";
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
      <div className={classes.container}>
        <img
          className={classes.logo}
          src="/static/1.svg"
          alt="Next Spot Logo"
          onClick={() => history.push("/")}
        />
        {!user ? (
          <>
            <div
              className={classes.profile}
              onClick={() => {
                setDisplay(!display);
              }}
            >
              <img
                alt="menu"
                className={classes.hamburger}
                src="/static/hamburger.svg"
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
              className={classes.profile}
              onClick={() => {
                setDisplay(!display);
              }}
            >
              <img
                alt="menu"
                className={classes.hamburger}
                src="/static/hamburger.svg"
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
