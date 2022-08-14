import React from "react";
import { NavLink } from "react-router-dom";
import classes from "./Oops.module.css";

function Oops() {
  return (
    <div>
      <div className={classes.main}>
        <div className={classes.text}>
          <h1 className={classes.header}>Oops!</h1>
          <h2 className={classes.subHeader}>
            We can't seem to find the page you're looking for.
          </h2>
          <h6 className={classes.error}>Error code: 404</h6>
          <div>Here are some helpful links instead:</div>
          <NavLink to="/">
            <div className={classes.links}>Home</div>
          </NavLink>
          <NavLink to="/login">
            <div className={classes.links}>Login</div>
          </NavLink>
          <NavLink to="/sign-up">
            <div className={classes.links}>Sign up</div>
          </NavLink>
          <div className={classes.links}>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.linkedin.com/in/justin-stockton-101a38a4/"
              className={classes.links}
            >
              Linkedin
            </a>
          </div>
          <div className={classes.links}>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://github.com/Justin-Stockton"
              className={classes.links}
            >
              Github
            </a>
          </div>
        </div>
        <img
          className={classes.img}
          alt="Girl dropping icecream"
          src="https://a0.muscache.com/airbnb/static/error_pages/404-Airbnb_final-d652ff855b1335dd3eedc3baa8dc8b69.gif"
        />
      </div>
    </div>
  );
}

export default Oops;
