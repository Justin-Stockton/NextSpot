import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import { login } from "../../../store/session";
import classes from "./LoginModal.module.css";

function LoginModal() {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const history = useHistory();

  const onLogin = async (e) => {
    e.preventDefault();
    if (!password.length && !email.length) {
      setErrors(["You must provide an email and password"]);
      return;
    }
    if (!password.length) {
      setErrors(["You must provide a password"]);
      return;
    }
    if (!email.length) {
      setErrors(["You must provide an email"]);
      return;
    }
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    }
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
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
            Log in or{" "}
            <span
              className={classes.signup}
              onClick={() => history.push("/sign-up")}
            >
              sign up
            </span>
          </div>
          <div className={classes.placeholder}></div>
        </div>
        <div className={classes.header}>Welcome to NextSpot</div>
        <form className={classes.form} onSubmit={onLogin}>
          <div>
            {errors.map((error, ind) => (
              <div key={ind}>{error}</div>
            ))}
          </div>
          <div className={classes.inputContainer}>
            <input
              className={`${classes.input} ${classes.email}`}
              type="text"
              name="email"
              onChange={updateEmail}
              value={email}
            />
            <label className={email && classes.filled}>Email</label>
          </div>
          <div className={classes.inputContainer}>
            <input
              className={`${classes.input} ${classes.password}`}
              type="password"
              name="password"
              onChange={updatePassword}
              value={password}
            />
            <label className={password && classes.filled}>Password</label>
          </div>
          <div>
            <button className={classes.button} type="submit">
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
