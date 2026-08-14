import React from "react";
import { Link } from "react-router-dom";

function Oops() {
  return <main className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center">
    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-rose-50 text-5xl" aria-hidden="true">🧭</div>
    <p className="mt-8 text-sm font-bold uppercase tracking-widest text-rose-600">404</p>
    <h1 className="mt-2 text-4xl font-extrabold text-gray-900">This journey ends here.</h1>
    <p className="mt-4 max-w-lg text-lg text-gray-600">We could not find that page, but your travel journal is still right where you left it.</p>
    <Link className="mt-8 rounded-lg bg-rose-600 px-6 py-3 font-bold text-white hover:bg-rose-500" to="/">Back to your journal</Link>
  </main>;
}

export default Oops;
