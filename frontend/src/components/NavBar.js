import React from "react";
import { NavLink } from "react-router-dom";
import LogoutButton from "./auth/LogoutButton";

const NavBar = () => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "1px solid rgb(235,235,235)",
          alignItems: "center",
          padding: "1%",
        }}
      >
        <div style={{ alignItems: "center", width: "80%" }}>
          <NavLink to="/" exact={true} activeClassName="active">
            Home
          </NavLink>
        </div>
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
        <div>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
