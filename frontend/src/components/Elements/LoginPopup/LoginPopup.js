import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import classes from "../ProfilePopup/ProfilePopup.module.css";
import { login } from "../../../store/session";

function LoginPopup({ display, setDisplay }) {
  const history = useHistory();
  const dispatch = useDispatch();

  const handleDemoLogin = async () => {
    setDisplay(false);
    await dispatch(login("demo@aa.io", "password"));
  };

  return (
    <>
      {display ? (
        <div className={classes.mainContainer}>
          <div
            onClick={() => {
              history.push(`/login`);
              setDisplay(false);
            }}
          >
            Login
          </div>
          <div
            onClick={() => {
              history.push(`/sign-up`);
              setDisplay(false);
            }}
          >
            Sign up
          </div>

          <div onClick={handleDemoLogin}>Demo</div>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/Justin-Stockton"
            className={classes.links}
          >
            <div
              onClick={() => setDisplay(false)}
              style={{ borderBottom: "none" }}
            >
              GitHub
            </div>
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.linkedin.com/"
            className={classes.links}
          >
            <div
              onClick={() => setDisplay(false)}
              style={{ borderBottom: "none" }}
            >
              Linkedin
            </div>
          </a>
        </div>
      ) : null}
    </>
  );
}

export default LoginPopup;
