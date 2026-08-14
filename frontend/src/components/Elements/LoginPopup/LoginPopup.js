import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { demoLogin } from "../../../store/session";

const menuItem = "flex h-11 cursor-pointer items-center px-4 hover:bg-gray-50";

function LoginPopup({ display, setDisplay, innerRef }) {
  const history = useHistory();
  const dispatch = useDispatch();

  const handleDemoLogin = async () => {
    setDisplay(false);
    await dispatch(demoLogin());
  };

  return (
    <>
      {display ? (
        <div className={'absolute right-4 top-16 z-20 w-60 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-xl sm:right-8 lg:right-[8%]'} ref={innerRef}>
          <div
            className={menuItem}
            onClick={() => {
              history.push(`/login`);
              setDisplay(false);
            }}
          >
            Login
          </div>
          <div
            className={menuItem}
            onClick={() => {
              history.push(`/sign-up`);
              setDisplay(false);
            }}
          >
            Sign up
          </div>

          <div className={menuItem} onClick={handleDemoLogin}>Demo</div>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/Justin-Stockton"
            className={`${menuItem} text-gray-800 no-underline`}
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
            href="https://www.linkedin.com/in/justin-stockton-101a38a4/"
            className={`${menuItem} text-gray-800 no-underline`}
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
