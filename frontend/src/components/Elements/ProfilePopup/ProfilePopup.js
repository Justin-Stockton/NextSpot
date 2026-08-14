import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/session";

const menuItem = "flex h-11 items-center px-4 text-gray-800 hover:bg-gray-50";

function ProfilePopup({ display, setDisplay, innerRef }) {
  const dispatch = useDispatch();
  const onLogout = async () => { setDisplay(false); await dispatch(logout()); };
  if (!display) return null;

  return <div className="absolute right-4 top-16 z-20 w-60 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-xl sm:right-8" ref={innerRef}>
    <Link className={menuItem} to="/" onClick={() => setDisplay(false)}>Dashboard</Link>
    <Link className={menuItem} to="/account" onClick={() => setDisplay(false)}>Account</Link>
    <a className={menuItem} target="_blank" rel="noreferrer" href="https://github.com/Justin-Stockton" onClick={() => setDisplay(false)}>GitHub</a>
    <a className={menuItem} target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/justin-stockton-101a38a4/" onClick={() => setDisplay(false)}>LinkedIn</a>
    <button className={`${menuItem} w-full`} onClick={onLogout}>Log out</button>
  </div>;
}

export default ProfilePopup;
