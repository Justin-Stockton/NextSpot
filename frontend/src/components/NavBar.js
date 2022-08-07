import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import LogoutButton from "./auth/LogoutButton";
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
          src="/media/1.svg"
          alt="Next Spot Logo"
          onClick={() => history.push("/")}
        />
        {!user ? (
          <>
            <div>
              <NavLink to="/login" exact={true} activeClassName="active">
                Login
              </NavLink>
            </div>
            <div>
              <NavLink to="/sign-up" exact={true} activeClassName="active">
                Sign Up
              </NavLink>
            </div>
          </>
        ) : (
          <>
            <div
              className={classes.profile}
              onClick={() => {
                !display ? setDisplay(true) : setDisplay(false);
              }}
            >
              Profile
            </div>
            <ProfilePopup setDisplay={setDisplay} display={display} />
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
