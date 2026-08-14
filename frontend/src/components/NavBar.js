import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginPopup from "./Elements/LoginPopup";
import ProfilePopup from "./Elements/ProfilePopup";
import useClickOutside from "../utils/useClickOutside";

const navItem = "whitespace-nowrap border-b-2 px-1 py-3 text-sm font-bold transition";
const navLinks = [['/', 'Dashboard'], ['/places', 'Places'], ['/timeline', 'Timeline'], ['/collections', 'Collections']];

function JournalLinks() {
  return navLinks.map(([to, label]) => <NavLink activeClassName="border-rose-600 text-rose-600" className={`${navItem} border-transparent text-gray-600 hover:text-gray-900`} exact={to === '/'} key={to} to={to}>{label}</NavLink>);
}

function NavBar() {
  const user = useSelector(state => state.session.user);
  const [display, setDisplay] = useState(false);
  const popupRef = useClickOutside(() => setDisplay(false));

  return <header className="relative z-20 border-b border-gray-200 bg-white">
    <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-8">
      <Link aria-label="NextSpot home" className="shrink-0 rounded-lg" to="/"><img className="h-14 w-24 object-contain" src="/media/1.svg" alt="NextSpot" /></Link>
      {user && <nav className="hidden items-center gap-6 md:flex" aria-label="Journal navigation"><JournalLinks /></nav>}
      <button aria-expanded={display} className="flex h-11 max-w-[10rem] items-center rounded-full border border-gray-300 bg-white px-4 font-semibold shadow-sm transition hover:shadow-md sm:max-w-xs" onClick={() => setDisplay(!display)}><img alt="" className="mr-2 h-4 w-4 shrink-0" src="/media/hamburger.svg" /><span className="truncate">{user ? user.username : "Login"}</span></button>
      {user ? <ProfilePopup setDisplay={setDisplay} innerRef={popupRef} display={display} /> : <LoginPopup innerRef={popupRef} setDisplay={setDisplay} display={display} />}
    </div>
    {user && <nav className="flex gap-6 overflow-x-auto px-4 md:hidden" aria-label="Mobile journal navigation"><JournalLinks /></nav>}
  </header>;
}

export default NavBar;
