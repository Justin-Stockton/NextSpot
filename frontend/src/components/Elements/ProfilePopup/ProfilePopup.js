import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import classes from "./ProfilePopup.module.css";
import { logout } from "../../../store/session";
import { thunkLogout } from "../../../store/userBookings";
import { thunkLogoutLists } from "../../../store/wishlists";

function ProfilePopup({ display, setDisplay, innerRef }) {
  const user = useSelector((state) => state.session.user);
  const history = useHistory();
  const dispatch = useDispatch();

  const onLogout = async (e) => {
    setDisplay(false);
    await dispatch(thunkLogoutLists());
    await dispatch(thunkLogout());
    await dispatch(logout());
  };

  return (
    <>
      {display ? (
        <div className={classes.mainContainer} ref={innerRef}>
          <div
            onClick={() => {
              history.push(`/my-wishlists`);
              setDisplay(false);
            }}
            style={{ borderBottom: "none" }}
          >
            Wishlists
          </div>
          <div
            onClick={() => {
              history.push(`/user/${user.username}`);
              setDisplay(false);
            }}
          >
            Trips
          </div>
          {/* <div
            onClick={() => {
              history.push(`/user/${user.username}/host`);
              setDisplay(false);
            }}
          >
            Host your home
          </div> */}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/Justin-Stockton"
            className={classes.links}
          >
            <div onClick={() => setDisplay(false)}>GitHub</div>
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.linkedin.com/in/justin-stockton-101a38a4/"
          >
            <div onClick={() => setDisplay(false)}>Linkedin</div>
          </a>
          <div className={classes.links} onClick={onLogout}>
            Log Out
          </div>
        </div>
      ) : null}
    </>
  );
}

export default ProfilePopup;
