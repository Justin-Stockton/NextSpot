import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import LoginPopup from "./Elements/LoginPopup";
import ProfilePopup from "./Elements/ProfilePopup";
import classes from "./Navbar.module.css";

const NavBar = () => {
  const history = useHistory();
  const user = useSelector((state) => state.session.user);
  const [display, setDisplay] = useState(false);
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
                !display ? setDisplay(true) : setDisplay(false);
              }}
            >
              Login
            </div>
            <LoginPopup setDisplay={setDisplay} display={display} />
          </>
        ) : (
          <>
            <div
              className={classes.profile}
              onClick={() => {
                !display ? setDisplay(true) : setDisplay(false);
              }}
            >
              {user.username}
            </div>
            <ProfilePopup setDisplay={setDisplay} display={display} />
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
