import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { formatDate, journalRequest, memoriesFor, placeStatus, staysFor, timelineFor, todayISO } from "../../../utils/journal";

const emptyPlace = {
  name: "", location: "", city: "", state: "", streetAdress: "", zip: "", price: "",
  img1: "", img2: "", img3: "", img4: "", img5: "", img6: "",
};
const views = {
  dashboard: ["Your travel journal", "A quick look at where you have been and what is next."],
  places: ["Places", "Every destination and stay, together in one place."],
  timeline: ["Travel timeline", "Your journeys in chronological order."],
  collections: ["Collections", "Group the places that matter to you."],
};
const button = "inline-flex min-h-[42px] items-center justify-center rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-500";
const secondary = "inline-flex min-h-[42px] items-center justify-center rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50";

function PlaceCard({ place }) {
  const memories = memoriesFor(place);
  const rating = memories.length ? (memories.reduce((sum, item) => sum + item.rating, 0) / memories.length).toFixed(1) : null;
  return <Link className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg" to={`/places/${place.id}`}>
    <div className="h-52 overflow-hidden bg-gradient-to-br from-rose-100 to-amber-100">
      {place.img1 ? <img className="h-full w-full object-cover transition duration-300 group-hover:scale-105" src={place.img1} alt="" /> : <div className="flex h-full items-center justify-center text-4xl" aria-hidden="true">✈️</div>}
    </div>
    <div className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div><h3 className="text-xl font-bold text-gray-900">{place.name}</h3><p className="mt-1 text-gray-600">{place.location}</p></div>
        <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700">{placeStatus(place)}</span>
      </div>
      <div className="mt-4 flex gap-4 text-sm text-gray-500"><span>{staysFor(place).length} {staysFor(place).length === 1 ? "stay" : "stays"}</span><span>{rating ? `★ ${rating}` : "No rating yet"}</span></div>
    </div>
  </Link>;
}

function PlaceGrid({ places, empty }) {
  if (!places.length) return <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-600">{empty}</div>;
  return <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{places.map(place => <PlaceCard place={place} key={place.id} />)}</div>;
}

function PlaceForm({ initial, onCancel, onSave }) {
  const [form, setForm] = useState(initial || emptyPlace);
  const [saving, setSaving] = useState(false);
  const update = event => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async event => {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    if (!await onSave(form)) setSaving(false);
  };
  return <form className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7" onSubmit={submit}>
    <div className="flex items-center justify-between"><h2 className="text-2xl font-bold">{initial ? "Edit Place" : "Add a Place"}</h2><button className="text-gray-500" type="button" onClick={onCancel}>Close</button></div>
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <label className="font-semibold">Name<input className="mt-1 w-full rounded-lg border border-gray-300 p-3 font-normal" name="name" required value={form.name} onChange={update} /></label>
      <label className="font-semibold">Location<input className="mt-1 w-full rounded-lg border border-gray-300 p-3 font-normal" name="location" required placeholder="Kyoto, Japan" value={form.location} onChange={update} /></label>
      <label className="font-semibold">City<input className="mt-1 w-full rounded-lg border border-gray-300 p-3 font-normal" name="city" value={form.city} onChange={update} /></label>
      <label className="font-semibold">State or region<input className="mt-1 w-full rounded-lg border border-gray-300 p-3 font-normal" name="state" value={form.state} onChange={update} /></label>
      <label className="font-semibold sm:col-span-2">Address <span className="font-normal text-gray-500">(private)</span><input className="mt-1 w-full rounded-lg border border-gray-300 p-3 font-normal" name="streetAdress" value={form.streetAdress} onChange={update} /></label>
      {[1, 2, 3, 4, 5, 6].map(number => <label className="font-semibold" key={number}>Photo URL {number}<input className="mt-1 w-full rounded-lg border border-gray-300 p-3 font-normal" name={`img${number}`} type="url" value={form[`img${number}`]} onChange={update} /></label>)}
    </div>
    <div className="mt-6 flex flex-wrap gap-3"><button className={button} disabled={saving}>{saving ? "Saving…" : "Save Place"}</button><button className={secondary} type="button" onClick={onCancel}>Cancel</button></div>
  </form>;
}

function JournalDashboard({ view = "dashboard" }) {
  const [places, setPlaces] = useState([]);
  const [collections, setCollections] = useState([]);
  const [editing, setEditing] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [editingCollection, setEditingCollection] = useState(null);
  const [savingCollection, setSavingCollection] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [placeResult, collectionResult] = await Promise.allSettled([journalRequest("/api/spots/"), journalRequest("/api/wishlists/")]);
    if (placeResult.status === "fulfilled") setPlaces(placeResult.value.spots);
    if (collectionResult.status === "fulfilled") setCollections(collectionResult.value.wishlists);
    setError(placeResult.status === "rejected" ? placeResult.reason.message : collectionResult.status === "rejected" ? `Places loaded, but Collections failed: ${collectionResult.reason.message}` : "");
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const mutate = async (path, method, body) => {
    try { await journalRequest(path, { method, body: JSON.stringify(body) }); await load(); return true; }
    catch (err) { setError(err.message); return false; }
  };
  const grouped = useMemo(() => Object.fromEntries(["Visited", "Planned", "Unscheduled"].map(status => [status, places.filter(place => placeStatus(place) === status)])), [places]);
  const timeline = useMemo(() => timelineFor(places), [places]);
  const savePlace = async form => {
    const ok = await mutate(editing?.id ? `/api/spots/${editing.id}` : "/api/spots/create", editing?.id ? "PUT" : "POST", form);
    if (ok) setEditing(false);
    return ok;
  };
  const saveCollection = async event => {
    event.preventDefault();
    if (savingCollection) return;
    setSavingCollection(true);
    if (await mutate(editingCollection ? "/api/wishlists/update" : "/api/wishlists/create", editingCollection ? "PUT" : "POST", editingCollection ? { id: editingCollection.id, name: collectionName } : { name: collectionName })) {
      setCollectionName(""); setEditingCollection(null);
    }
    setSavingCollection(false);
  };

  const [title, subtitle] = views[view] || views.dashboard;
  return <main className="mx-auto max-w-7xl px-4 pb-20 sm:px-8">
    <header className="flex flex-col gap-5 py-7 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-sm font-bold uppercase tracking-widest text-rose-600">NextSpot</p><h1 className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl">{title}</h1><p className="mt-2 text-gray-600">{subtitle}</p></div>
      {view === "places" && <button className={button} onClick={() => setEditing(emptyPlace)}>Add Place</button>}
    </header>
    {error && <p className="mb-6 rounded-xl bg-red-50 p-4 text-red-700" role="alert">{error}</p>}
    {loading ? <p className="py-16 text-center text-gray-500">Loading your journal…</p> : null}

    {!loading && view === "dashboard" && <>
      <section className="grid gap-4 sm:grid-cols-3" aria-label="Journal summary">
        {["Visited", "Planned", "Unscheduled"].map(status => <Link className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm" key={status} to="/places"><p className="text-sm font-bold uppercase tracking-wide text-gray-500">{status}</p><p className="mt-2 text-4xl font-extrabold text-gray-900">{grouped[status].length}</p></Link>)}
      </section>
      {grouped.Planned.length > 0 && <section className="mt-10"><div className="mb-4 flex items-end justify-between"><div><p className="text-sm font-bold text-rose-600">COMING UP</p><h2 className="text-2xl font-bold">Next adventures</h2></div><Link className="font-semibold text-rose-600" to="/timeline">View timeline</Link></div><PlaceGrid places={grouped.Planned} /></section>}
      <section className="mt-10"><div className="mb-4 flex items-end justify-between"><h2 className="text-2xl font-bold">Recently visited</h2><Link className="font-semibold text-rose-600" to="/places">All Places</Link></div><PlaceGrid places={grouped.Visited} empty="Past stays will appear here." /></section>
    </>}

    {!loading && view === "places" && <>
      {editing && <PlaceForm initial={editing.id ? editing : null} onCancel={() => setEditing(false)} onSave={savePlace} />}
      {["Planned", "Visited", "Unscheduled"].map(status => <section className="mb-12" key={status}><div className="mb-4 flex items-baseline justify-between"><h2 className="text-2xl font-bold">{status}</h2><span className="text-sm text-gray-500">{grouped[status].length}</span></div><PlaceGrid places={grouped[status]} empty={`No ${status.toLowerCase()} Places.`} /></section>)}
    </>}

    {!loading && view === "timeline" && <section className="mx-auto max-w-3xl">
      {!timeline.length ? <PlaceGrid places={[]} empty="Add a Stay to begin your timeline." /> : <ol className="relative border-l-2 border-rose-200 pl-7">{timeline.map(item => <li className="relative mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm" key={item.id}><span className="absolute top-6 h-4 w-4 rounded-full border-4 border-white bg-rose-500" style={{ left: "-2.2rem" }} /><p className="text-sm font-bold uppercase tracking-wide text-rose-600">{item.endDate < todayISO() ? "Visited" : "Planned"}</p><Link className="mt-1 block text-xl font-bold" to={`/places/${item.place.id}`}>{item.place.name}</Link><p className="mt-1 text-gray-600">{item.place.location}</p><p className="mt-3 font-semibold">{formatDate(item.startDate)} – {formatDate(item.endDate)}</p></li>)}</ol>}
    </section>}

    {!loading && view === "collections" && <>
      <form className="mb-8 flex max-w-xl flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 sm:flex-row" onSubmit={saveCollection}><label className="flex-1 font-semibold">{editingCollection ? "Rename Collection" : "New Collection"}<input className="mt-1 w-full rounded-lg border border-gray-300 p-3 font-normal" required value={collectionName} onChange={event => setCollectionName(event.target.value)} /></label><button className={`${button} sm:self-end`} disabled={savingCollection}>{savingCollection ? "Saving…" : editingCollection ? "Save" : "Add Collection"}</button>{editingCollection && <button className={`${secondary} sm:self-end`} type="button" onClick={() => { setEditingCollection(null); setCollectionName(""); }}>Cancel</button>}</form>
      <div className="grid gap-6 lg:grid-cols-2">{collections.map(collection => <article className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm" key={collection.id}><div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><h2 className="break-words text-2xl font-bold">{collection.name}</h2><p className="text-sm text-gray-500">{Object.keys(collection.wishspots || {}).length} {Object.keys(collection.wishspots || {}).length === 1 ? "Place" : "Places"}</p></div><div className="flex flex-wrap gap-2"><button className={secondary} onClick={() => { setEditingCollection(collection); setCollectionName(collection.name); }}>Rename</button><button className="px-2 font-semibold text-red-600" onClick={() => window.confirm(`Delete ${collection.name}?`) && mutate("/api/wishlists/delete", "DELETE", { id: collection.id })}>Delete</button></div></div><fieldset className="mt-5 border-t border-gray-100 pt-4"><legend className="font-semibold">Places</legend>{places.map(place => { const included = Object.values(collection.wishspots || {}).some(member => member.spotId === place.id); return <label className="mt-3 flex min-h-[40px] items-center gap-3" key={place.id}><input className="h-5 w-5 rounded text-rose-600" type="checkbox" checked={included} onChange={() => mutate(included ? "/api/wishspots/delete" : "/api/wishspots/create", included ? "DELETE" : "POST", { wishlistId: collection.id, spotId: place.id })} /><span>{place.name}</span></label>; })}</fieldset></article>)}{!collections.length && <PlaceGrid places={[]} empty="Create a Collection for favorites, wish lists, or road trips." />}</div>
    </>}
  </main>;
}

export default JournalDashboard;
