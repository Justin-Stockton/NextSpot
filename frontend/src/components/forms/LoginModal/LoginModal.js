import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import { login } from "../../../store/session";

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
    <div className={'flex w-full justify-center px-4 py-12'}>
      <div className={'w-full max-w-md rounded-2xl border border-gray-200 bg-white px-6 shadow-xl'}>
        <div className={'flex justify-between border-b border-gray-200 py-5'}>
          <div className={'h-px w-px'}></div>
          <div>
            Log in or{" "}
            <span
              className={'cursor-pointer font-bold text-rose-600 underline'}
              onClick={() => history.push("/sign-up")}
            >
              sign up
            </span>
          </div>
          <div className={'h-px w-px'}></div>
        </div>
        <div className={'py-6 text-2xl font-bold'}>Welcome to NextSpot</div>
        <form className={'flex flex-col'} onSubmit={onLogin}>
          <div>
            {errors.map((error, ind) => (
              <div key={ind}>{error}</div>
            ))}
          </div>
          <div className={'relative flex flex-col'}>
            <input
              className={`${'peer min-h-[58px] w-full border border-gray-300 px-4 pt-5 focus:z-10 focus:border-rose-500'} ${'rounded-t-xl'}`}
              type="text"
              name="email"
              onChange={updateEmail}
              value={email}
            />
            <label className="absolute left-4 top-2 text-xs text-gray-500">Email</label>
          </div>
          <div className={'relative flex flex-col'}>
            <input
              className={`${'peer min-h-[58px] w-full border border-gray-300 px-4 pt-5 focus:z-10 focus:border-rose-500'} ${'mb-5 rounded-b-xl border-t-0'}`}
              type="password"
              name="password"
              onChange={updatePassword}
              value={password}
            />
            <label className="absolute left-4 top-2 text-xs text-gray-500">Password</label>
          </div>
          <div>
            <button className={'inline-flex cursor-pointer items-center justify-center rounded-lg bg-rose-500 px-5 py-3 font-bold text-white hover:bg-rose-600 focus:ring-2 focus:ring-rose-500 mb-6 w-full'} type="submit">
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
