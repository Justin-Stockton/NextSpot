import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { logout } from "../../../store/session";
import { thunkLogout } from "../../../store/userBookings";
import { thunkLogoutLists } from "../../../store/wishlists";

const menuItem = "flex h-11 cursor-pointer items-center px-4 hover:bg-gray-50";

function ProfilePopup({ display, setDisplay, innerRef }) {
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
        <div className={'absolute right-4 top-16 z-20 w-60 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-xl sm:right-8 lg:right-[8%]'} ref={innerRef}>
          <div className={menuItem} onClick={() => { history.push("/"); setDisplay(false); }}>
            Travel journal
          </div>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/Justin-Stockton"
            className={`${menuItem} text-gray-800 no-underline`}
          >
            <div onClick={() => setDisplay(false)}>GitHub</div>
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.linkedin.com/in/justin-stockton-101a38a4/"
            className={`${menuItem} text-gray-800 no-underline`}
          >
            <div onClick={() => setDisplay(false)}>Linkedin</div>
          </a>
          <div className={`${menuItem} text-gray-800 no-underline`} onClick={onLogout}>
            Log Out
          </div>
        </div>
      ) : null}
    </>
  );
}

export default ProfilePopup;
