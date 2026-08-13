import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import JournalDashboard from "./JournalDashboard";

function HomePage() {
  const user = useSelector((state) => state.session.user);

  if (!user) return (
    <main className="mx-auto max-w-5xl px-6 py-20 text-center">
      <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">Keep your travels close.</h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">NextSpot is your private travel journal for Places, Stays, Memories, and Collections.</p>
      <div className="mt-10 flex justify-center gap-4">
        <Link className="rounded-lg bg-rose-600 px-6 py-3 font-semibold text-white" to="/sign-up">Create your journal</Link>
        <Link className="rounded-lg border border-gray-300 px-6 py-3 font-semibold" to="/login">Log in</Link>
      </div>
    </main>
  );

  return <JournalDashboard />;
}

export default HomePage;
