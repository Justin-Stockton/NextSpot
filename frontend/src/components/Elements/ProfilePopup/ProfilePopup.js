import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import classes from "./ProfilePopup.module.css";
import { logout } from "../../../store/session";

function ProfilePopup({ setDisplay, display }) {
  const user = useSelector((state) => state.session.user);
  const history = useHistory();
  const dispatch = useDispatch();

  const onLogout = async (e) => {
    await dispatch(logout());
  };

  return (
    <>
      {display ? (
        <div className={classes.mainContainer}>
          <div onClick={() => history.push(`/${user.username}`)}>
            My Bookings
          </div>
          <div onClick={onLogout}>Log Out</div>
          <a
            target="_blank"
            href="https://github.com/Justin-Stockton"
            className={classes.links}
          >
            <div style={{ borderBottom: "none" }}>GitHub</div>
          </a>
        </div>
      ) : null}
    </>
  );
}

export default ProfilePopup;