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
          {/* <div onClick={() => setLoginDisplay(false)}>X</div> */}
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
          <div>
            <input
              className={`${classes.input} ${classes.email}`}
              name="email"
              type="text"
              placeholder="Email"
              value={email}
              onChange={updateEmail}
            />
          </div>
          <div>
            <input
              className={`${classes.input} ${classes.password}`}
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={updatePassword}
            />
            <div>
              <button className={classes.button} type="submit">
                Log in
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
