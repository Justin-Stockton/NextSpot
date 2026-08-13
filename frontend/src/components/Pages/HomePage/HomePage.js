import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetWishlists } from "../../../store/wishlists";
import SpotCard from "../../Elements/SpotCard";

function HomePage() {
  const spots = useSelector((state) => state.spots);
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) dispatch(thunkGetWishlists(user.id));
  }, [dispatch, user]);

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

  const places = Object.values(spots);
  const today = new Date().toISOString().slice(0, 10);
  const groups = { Planned: [], Visited: [], Unscheduled: [] };
  places.forEach((place) => {
    const stays = Object.values(place.spot.bookings || {});
    const group = stays.some((stay) => String(stay.endDate).slice(0, 10) >= today)
      ? "Planned" : stays.length ? "Visited" : "Unscheduled";
    groups[group].push(place);
  });

  return <main className="mx-auto max-w-7xl px-4 pb-12 sm:px-8">
    <h1 className="py-6 text-3xl font-bold">Your travel journal</h1>
    {!places.length && <p className="rounded-lg bg-gray-50 p-8 text-gray-600">No Places yet. Add a Place to start your journal.</p>}
    {Object.entries(groups).map(([name, items]) => <section className="mb-10" key={name}>
      <h2 className="mb-4 text-2xl font-semibold">{name}</h2>
      {!items.length ? <p className="text-gray-500">No {name.toLowerCase()} Places.</p> :
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((place) => <SpotCard key={place.spot.id} spot={place.spot} />)}
        </div>}
    </section>)}
  </main>;
}

export default HomePage;
