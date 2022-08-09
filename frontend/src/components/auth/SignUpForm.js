import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import { signUp } from "../../store/session";

import classes from "./SignUpForm.module.css";

const SignUpForm = () => {
  const [errors, setErrors] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const history = useHistory();

  const onSignUp = async (e) => {
    e.preventDefault();
    if (!email.split("").includes("@"))
      return setErrors(["You must provide a valid email"]);
    if (!email.split("").includes("."))
      return setErrors(["You must provide a valid email"]);
    if (password === repeatPassword) {
      const data = await dispatch(signUp(username, email, password));
      if (data) {
        setErrors(data);
      }
    } else {
      return setErrors(["Passwords didn't match"]);
    }
  };

  const updateUsername = (e) => {
    setUsername(e.target.value);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateRepeatPassword = (e) => {
    setRepeatPassword(e.target.value);
  };

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className={classes.modalBackground}>
      <div className={classes.modalForeground}>
        <div className={classes.formTop}>
          <div className={classes.placeholder}></div>
          <div>
            Sign up or{" "}
            <span
              className={classes.signup}
              onClick={() => history.push("/login")}
            >
              Login
            </span>
          </div>
          <div className={classes.placeholder}></div>
        </div>
        <div className={classes.header}>Welcome to NextSpot</div>
        <form className={classes.form} onSubmit={onSignUp}>
          <div>
            {errors.map((error, ind) => (
              <div key={ind}>{error}</div>
            ))}
          </div>
          <div>
            <input
              className={`${classes.input} ${classes.email}`}
              type="text"
              name="email"
              placeholder="Email"
              onChange={updateEmail}
              value={email}
            ></input>
          </div>
          <div>
            <input
              className={`${classes.input} ${classes.username}`}
              type="text"
              name="username"
              placeholder="Username"
              onChange={updateUsername}
              value={username}
            ></input>
          </div>
          <div>
            <input
              className={classes.input}
              type="password"
              name="password"
              placeholder="Password"
              onChange={updatePassword}
              value={password}
            ></input>
          </div>
          <div>
            <input
              className={`${classes.input} ${classes.password}`}
              type="password"
              name="repeat_password"
              placeholder="Confirm password"
              onChange={updateRepeatPassword}
              value={repeatPassword}
              required={true}
            ></input>
          </div>
          <button className={classes.button} type="submit">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
