import React from "react";
import { NavLink } from "react-router-dom";

function Oops() {
  return (
    <div>
      <div className={'mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 py-12 md:flex-row'}>
        <div className={'flex flex-1 flex-col'}>
          <h1 className={'mb-6 text-7xl font-extrabold text-gray-700 md:text-8xl'}>Oops!</h1>
          <h2 className={'mb-4 text-2xl font-normal leading-tight text-gray-700'}>
            We can't seem to find the page you're looking for.
          </h2>
          <h6 className={'mb-5 text-sm font-bold text-gray-500'}>Error code: 404</h6>
          <div>Here are some helpful links instead:</div>
          <NavLink to="/">
            <div className={'mt-2 text-rose-600 hover:underline'}>Home</div>
          </NavLink>
          <NavLink to="/login">
            <div className={'mt-2 text-rose-600 hover:underline'}>Login</div>
          </NavLink>
          <NavLink to="/sign-up">
            <div className={'mt-2 text-rose-600 hover:underline'}>Sign up</div>
          </NavLink>
          <div className={'mt-2 text-rose-600 hover:underline'}>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.linkedin.com/in/justin-stockton-101a38a4/"
              className={'mt-2 text-rose-600 hover:underline'}
            >
              Linkedin
            </a>
          </div>
          <div className={'mt-2 text-rose-600 hover:underline'}>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://github.com/Justin-Stockton"
              className={'mt-2 text-rose-600 hover:underline'}
            >
              Github
            </a>
          </div>
        </div>
        <img
          className={'max-h-[26rem] max-w-full object-contain'}
          alt="Girl dropping icecream"
          src="https://a0.muscache.com/airbnb/static/error_pages/404-Airbnb_final-d652ff855b1335dd3eedc3baa8dc8b69.gif"
        />
      </div>
    </div>
  );
}

export default Oops;
