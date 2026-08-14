import React from "react";
import { useSelector } from "react-redux";

function AccountPage() {
  const user = useSelector(state => state.session.user);
  return <main className="mx-auto max-w-3xl px-4 pb-20 sm:px-8">
    <header className="py-8"><p className="text-sm font-bold uppercase tracking-widest text-rose-600">Account</p><h1 className="mt-1 text-4xl font-extrabold">Your profile</h1></header>
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <dl className="grid gap-6 sm:grid-cols-2"><div><dt className="text-sm font-bold uppercase tracking-wide text-gray-500">Name</dt><dd className="mt-1 text-lg font-semibold">{user.username}</dd></div><div><dt className="text-sm font-bold uppercase tracking-wide text-gray-500">Email</dt><dd className="mt-1 text-lg font-semibold">{user.email}</dd></div></dl>
      <div className="mt-8 rounded-xl bg-rose-50 p-5"><h2 className="font-bold text-rose-900">Private by default</h2><p className="mt-1 text-rose-800">Your Places, Stays, Memories, and Collections are visible only in your signed-in journal.</p></div>
    </section>
  </main>;
}

export default AccountPage;
