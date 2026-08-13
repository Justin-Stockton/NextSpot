import React, { useCallback, useEffect, useState } from "react";
import { jsonHeaders } from "../../../utils/csrf";

const emptyPlace = { name: "", location: "", img1: "" };

async function request(path, options) {
  const response = await fetch(path, {
    headers: jsonHeaders(),
    ...options,
  });
  const data = await response.json();
  if (!response.ok) throw new Error((data.errors || ["Something went wrong"])[0]);
  return data;
}

function JournalDashboard() {
  const [places, setPlaces] = useState([]);
  const [collections, setCollections] = useState([]);
  const [placeForm, setPlaceForm] = useState(emptyPlace);
  const [editingPlace, setEditingPlace] = useState(null);
  const [collectionName, setCollectionName] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [placeData, collectionData] = await Promise.all([
        request("/api/spots/"), request("/api/wishlists/"),
      ]);
      setPlaces(placeData.spots);
      setCollections(collectionData.wishlists);
      setError("");
    } catch (err) { setError(err.message); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const mutate = async (path, method, body) => {
    try {
      await request(path, { method, body: JSON.stringify(body) });
      await load();
      return true;
    } catch (err) { setError(err.message); return false; }
  };

  const savePlace = async (event) => {
    event.preventDefault();
    const ok = await mutate(editingPlace ? `/api/spots/${editingPlace}` : "/api/spots/create", editingPlace ? "PUT" : "POST", placeForm);
    if (ok) { setPlaceForm(emptyPlace); setEditingPlace(null); }
  };

  const beginPlaceEdit = (place) => {
    setEditingPlace(place.id);
    setPlaceForm({ name: place.name, location: place.location, img1: place.img1 || "" });
    window.scrollTo(0, 0);
  };

  const addStay = async (place) => {
    const startDate = window.prompt("Arrival date (YYYY-MM-DD)");
    if (!startDate) return;
    const endDate = window.prompt("Departure date (YYYY-MM-DD)");
    if (endDate) await mutate("/api/bookings/create", "POST", { spotId: place.id, startDate, endDate });
  };

  const editStay = async (stay) => {
    const startDate = window.prompt("Arrival date (YYYY-MM-DD)", String(stay.startDate).slice(0, 10));
    if (!startDate) return;
    const endDate = window.prompt("Departure date (YYYY-MM-DD)", String(stay.endDate).slice(0, 10));
    if (endDate) await mutate("/api/bookings/update", "PUT", { id: stay.id, startDate, endDate });
  };

  const addMemory = async (place) => {
    const review = window.prompt("What do you want to remember?");
    if (!review) return;
    const rating = Number(window.prompt("Rating from 1 to 5", "5"));
    await mutate("/api/reviews/create", "POST", { spotId: place.id, review, rating });
  };

  const editMemory = async (memory) => {
    const review = window.prompt("Memory", memory.review);
    if (!review) return;
    const rating = Number(window.prompt("Rating from 1 to 5", String(memory.rating)));
    await mutate("/api/reviews/update", "PUT", { id: memory.id, review, rating });
  };

  const createCollection = async (event) => {
    event.preventDefault();
    if (await mutate("/api/wishlists/create", "POST", { name: collectionName })) setCollectionName("");
  };

  const editCollection = async (collection) => {
    const name = window.prompt("Collection name", collection.name);
    if (name) await mutate("/api/wishlists/update", "PUT", { id: collection.id, name });
  };

  const toggleMembership = (collection, place, included) => mutate(
    included ? "/api/wishspots/delete" : "/api/wishspots/create",
    included ? "DELETE" : "POST",
    { wishlistId: collection.id, spotId: place.id }
  );

  return <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-8">
    <header className="py-6">
      <h1 className="text-3xl font-bold">Your travel journal</h1>
      <p className="mt-2 text-gray-600">Private Places, Stays, Memories, and Collections—only for you.</p>
    </header>
    {error && <p role="alert" className="mb-4 rounded bg-red-50 p-3 text-red-700">{error}</p>}

    <section className="mb-10 rounded-xl border p-5">
      <h2 className="text-xl font-semibold">{editingPlace ? "Edit Place" : "Add a Place"}</h2>
      <form className="mt-4 grid gap-3 sm:grid-cols-3" onSubmit={savePlace}>
        <label>Name<input aria-label="Place name" className="mt-1 w-full rounded border p-2" required value={placeForm.name} onChange={e => setPlaceForm({...placeForm, name: e.target.value})} /></label>
        <label>Location<input aria-label="Place location" className="mt-1 w-full rounded border p-2" required value={placeForm.location} onChange={e => setPlaceForm({...placeForm, location: e.target.value})} /></label>
        <label>Photo URL<input aria-label="Photo URL" className="mt-1 w-full rounded border p-2" type="url" value={placeForm.img1} onChange={e => setPlaceForm({...placeForm, img1: e.target.value})} /></label>
        <div className="flex gap-2"><button className="rounded bg-rose-600 px-4 py-2 text-white">{editingPlace ? "Save Place" : "Add Place"}</button>{editingPlace && <button type="button" onClick={() => { setEditingPlace(null); setPlaceForm(emptyPlace); }}>Cancel</button>}</div>
      </form>
    </section>

    <section>
      <h2 className="mb-4 text-2xl font-semibold">Places</h2>
      {!places.length && <p>No Places yet. Add one above to begin.</p>}
      <div className="grid gap-5 md:grid-cols-2">
        {places.map(place => {
          const stays = Object.values(place.bookings || {});
          const memories = Object.values(place.reviews || {});
          return <article className="overflow-hidden rounded-xl border" key={place.id}>
            {place.img1 && <img className="h-48 w-full object-cover" src={place.img1} alt={`${place.name}`} />}
            <div className="p-5">
              <h3 className="text-xl font-bold">{place.name}</h3><p>{place.location}</p>
              <div className="mt-3 flex flex-wrap gap-2"><button onClick={() => beginPlaceEdit(place)}>Edit Place</button><button onClick={() => mutate(`/api/spots/${place.id}`, "DELETE", {})}>Delete Place</button></div>
              <h4 className="mt-5 font-semibold">Stays</h4>
              {stays.map(stay => <div className="mt-2 flex justify-between gap-2" key={stay.id}><span>{String(stay.startDate).slice(0, 10)} – {String(stay.endDate).slice(0, 10)}</span><span><button onClick={() => editStay(stay)}>Edit</button> · <button onClick={() => mutate("/api/bookings/delete", "DELETE", {id: stay.id})}>Delete</button></span></div>)}
              <button className="mt-2" onClick={() => addStay(place)}>Add Stay</button>
              <h4 className="mt-5 font-semibold">Memories</h4>
              {memories.map(memory => <div className="mt-2" key={memory.id}><p>{memory.review} · {memory.rating}/5</p><button onClick={() => editMemory(memory)}>Edit</button> · <button onClick={() => mutate("/api/reviews/delete", "DELETE", {id: memory.id})}>Delete</button></div>)}
              <button className="mt-2" onClick={() => addMemory(place)}>Add Memory</button>
            </div>
          </article>;
        })}
      </div>
    </section>

    <section className="mt-12">
      <h2 className="text-2xl font-semibold">Collections</h2>
      <form className="my-4 flex max-w-md gap-2" onSubmit={createCollection}><input aria-label="Collection name" className="flex-1 rounded border p-2" required value={collectionName} onChange={e => setCollectionName(e.target.value)} placeholder="Collection name" /><button className="rounded bg-rose-600 px-4 text-white">Add Collection</button></form>
      <div className="grid gap-4 md:grid-cols-2">{collections.map(collection => <article className="rounded-xl border p-5" key={collection.id}>
        <h3 className="text-xl font-bold">{collection.name}</h3><button onClick={() => editCollection(collection)}>Edit Collection</button> · <button onClick={() => mutate("/api/wishlists/delete", "DELETE", {id: collection.id})}>Delete Collection</button>
        <fieldset className="mt-3"><legend className="font-semibold">Places in this Collection</legend>{places.map(place => {
          const included = Object.values(collection.wishspots || {}).some(member => member.spotId === place.id);
          return <label className="mt-2 block" key={place.id}><input type="checkbox" checked={included} onChange={() => toggleMembership(collection, place, included)} /> {place.name}</label>;
        })}</fieldset>
      </article>)}</div>
    </section>
  </main>;
}

export default JournalDashboard;
