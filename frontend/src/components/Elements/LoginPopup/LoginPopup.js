import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { demoLogin } from "../../../store/session";

const menuItem = "flex h-11 w-full items-center px-4 text-left text-gray-800 hover:bg-gray-50";

function LoginPopup({ display, setDisplay, innerRef }) {
  const dispatch = useDispatch();
  const handleDemoLogin = async () => { setDisplay(false); await dispatch(demoLogin()); };
  if (!display) return null;

  return <div className="absolute right-4 top-16 z-20 w-60 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-xl sm:right-8" ref={innerRef}>
    <Link className={menuItem} to="/login" onClick={() => setDisplay(false)}>Log in</Link>
    <Link className={menuItem} to="/sign-up" onClick={() => setDisplay(false)}>Sign up</Link>
    <button className={menuItem} onClick={handleDemoLogin}>Explore the demo</button>
    <a className={menuItem} target="_blank" rel="noreferrer" href="https://github.com/Justin-Stockton" onClick={() => setDisplay(false)}>GitHub</a>
    <a className={menuItem} target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/justin-stockton-101a38a4/" onClick={() => setDisplay(false)}>LinkedIn</a>
  </div>;
}

export default LoginPopup;
