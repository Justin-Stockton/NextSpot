import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { formatDate, journalRequest, memoriesFor, placeStatus, staysFor, todayISO } from "../../../utils/journal";

const button = "inline-flex min-h-[42px] items-center justify-center rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-500";
const secondary = "inline-flex min-h-[42px] items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50";
const input = "mt-1 w-full rounded-lg border border-gray-300 p-3 font-normal";

function StayForm({ stay, onCancel, onSave }) {
  const [form, setForm] = useState(stay || { startDate: "", endDate: "" });
  const [saving, setSaving] = useState(false);
  const submit = async event => {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    if (!await onSave(form)) setSaving(false);
  };
  return <form className="mt-4 grid gap-4 rounded-xl bg-gray-50 p-4 sm:grid-cols-2" onSubmit={submit}>
    <label className="font-semibold">Arrival<input aria-label="Arrival" className={input} type="date" required value={form.startDate} onChange={event => setForm({ ...form, startDate: event.target.value })} /></label>
    <label className="font-semibold">Departure<input aria-label="Departure" className={input} type="date" min={form.startDate} required value={form.endDate} onChange={event => setForm({ ...form, endDate: event.target.value })} /></label>
    <div className="flex gap-3 sm:col-span-2"><button className={button} disabled={saving}>{saving ? "Saving…" : stay ? "Save Stay" : "Add Stay"}</button><button className={secondary} type="button" onClick={onCancel}>Cancel</button></div>
  </form>;
}

function MemoryForm({ memory, onCancel, onSave }) {
  const [form, setForm] = useState(memory || { review: "", rating: 5 });
  const [saving, setSaving] = useState(false);
  const submit = async event => {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    if (!await onSave({ ...form, rating: Number(form.rating) })) setSaving(false);
  };
  return <form className="mt-4 rounded-xl bg-gray-50 p-4" onSubmit={submit}>
    <label className="font-semibold">What do you want to remember?<textarea aria-label="Memory" className={`${input} min-h-[120px]`} required maxLength="1000" value={form.review} onChange={event => setForm({ ...form, review: event.target.value })} /></label>
    <label className="mt-4 block max-w-xs font-semibold">Rating<select aria-label="Rating" className={input} value={form.rating} onChange={event => setForm({ ...form, rating: event.target.value })}>{[5, 4, 3, 2, 1].map(value => <option value={value} key={value}>{value} — {value === 5 ? "Unforgettable" : value === 1 ? "Disappointing" : ""}</option>)}</select></label>
    <div className="mt-4 flex gap-3"><button className={button} disabled={saving}>{saving ? "Saving…" : memory ? "Save Memory" : "Add Memory"}</button><button className={secondary} type="button" onClick={onCancel}>Cancel</button></div>
  </form>;
}

function EditPlaceForm({ place, onCancel, onSave }) {
  const [form, setForm] = useState(place);
  const [saving, setSaving] = useState(false);
  const update = event => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async event => {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    if (!await onSave(form)) setSaving(false);
  };
  return <form className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm" onSubmit={submit}>
    <h2 className="text-xl font-bold">Edit Place</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">
      <label className="font-semibold">Name<input className={input} name="name" required value={form.name} onChange={update} /></label><label className="font-semibold">Location<input className={input} name="location" required value={form.location} onChange={update} /></label>
      <label className="font-semibold">City<input className={input} name="city" value={form.city || ""} onChange={update} /></label><label className="font-semibold">State or region<input className={input} name="state" value={form.state || ""} onChange={update} /></label>
      {[1, 2, 3, 4, 5, 6].map(number => <label className="font-semibold" key={number}>Photo URL {number}<input className={input} name={`img${number}`} type="url" value={form[`img${number}`] || ""} onChange={update} /></label>)}
    </div><div className="mt-5 flex gap-3"><button className={button} disabled={saving}>{saving ? "Saving…" : "Save Place"}</button><button className={secondary} type="button" onClick={onCancel}>Cancel</button></div>
  </form>;
}

function SpotPage() {
  const { placeId } = useParams();
  const id = placeId;
  const history = useHistory();
  const [place, setPlace] = useState(null);
  const [collections, setCollections] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [stayForm, setStayForm] = useState(false);
  const [memoryForm, setMemoryForm] = useState(false);
  const [editingPlace, setEditingPlace] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const [placeResult, collectionResult] = await Promise.allSettled([journalRequest(`/api/spots/${id}`), journalRequest("/api/wishlists/")]);
    if (placeResult.status === "fulfilled") setPlace(placeResult.value);
    if (collectionResult.status === "fulfilled") setCollections(collectionResult.value.wishlists);
    setError(placeResult.status === "rejected" ? placeResult.reason.message : collectionResult.status === "rejected" ? `Place loaded, but Collections failed: ${collectionResult.reason.message}` : "");
  }, [id]);
  useEffect(() => { load(); }, [load]);
  const mutate = async (path, method, body, done) => {
    try { await journalRequest(path, { method, body: JSON.stringify(body) }); if (done) done(); await load(); return true; }
    catch (err) { setError(err.message); return false; }
  };

  const images = useMemo(() => place ? [1, 2, 3, 4, 5, 6].map(number => place[`img${number}`]).filter(Boolean) : [], [place]);
  useEffect(() => { if (activeImage >= images.length) setActiveImage(0); }, [activeImage, images.length]);
  if (!place) return <main className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-8">{error || "Loading Place…"}</main>;
  const stays = staysFor(place).sort((a, b) => b.startDate.localeCompare(a.startDate));
  const memories = memoriesFor(place).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  const rating = memories.length ? (memories.reduce((sum, memory) => sum + memory.rating, 0) / memories.length).toFixed(1) : null;

  const saveStay = form => mutate(stayForm.id ? "/api/bookings/update" : "/api/bookings/create", stayForm.id ? "PUT" : "POST", stayForm.id ? { id: stayForm.id, startDate: form.startDate, endDate: form.endDate } : { spotId: place.id, startDate: form.startDate, endDate: form.endDate }, () => setStayForm(false));
  const saveMemory = form => mutate(memoryForm.id ? "/api/reviews/update" : "/api/reviews/create", memoryForm.id ? "PUT" : "POST", memoryForm.id ? { id: memoryForm.id, ...form } : { spotId: place.id, ...form }, () => setMemoryForm(false));
  const deletePlace = async () => {
    if (!window.confirm(`Delete ${place.name}?`)) return;
    try { await journalRequest(`/api/spots/${place.id}`, { method: "DELETE", body: "{}" }); history.push("/places"); }
    catch (err) { setError(err.message); }
  };

  return <main className="mx-auto max-w-7xl px-4 pb-20 sm:px-8">
    <div className="py-5"><Link className="font-semibold text-gray-600 hover:text-rose-600" to="/places">← All Places</Link></div>
    {error && <p className="mb-5 rounded-xl bg-red-50 p-4 text-red-700" role="alert">{error}</p>}
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-rose-50 px-3 py-1 text-sm font-bold text-rose-700">{placeStatus(place)}</span>{rating && <span className="font-semibold">★ {rating}</span>}</div><h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">{place.name}</h1><p className="mt-1 text-lg text-gray-600">{place.location}</p></div><div className="flex gap-3"><button className={secondary} onClick={() => setEditingPlace(true)}>Edit Place</button><button className="font-semibold text-red-600" onClick={deletePlace}>Delete</button></div></header>

    {images.length ? <section className="grid h-[24rem] grid-cols-1 gap-2 overflow-hidden rounded-2xl sm:h-[32rem] md:grid-cols-2" aria-label="Place photo gallery"><button className="h-full min-h-0 overflow-hidden" onClick={() => setActiveImage((activeImage + 1) % images.length)} type="button"><img className="h-full w-full object-cover" src={images[activeImage]} alt={`${place.name} view ${activeImage + 1}`} /></button><div className="hidden min-h-0 grid-cols-2 grid-rows-2 gap-2 md:grid">{images.slice(1, 5).map((image, index) => <button className="min-h-0 overflow-hidden" type="button" onClick={() => setActiveImage(index + 1)} key={image}><img className="h-full w-full object-cover" src={image} alt={`${place.name} thumbnail ${index + 2}`} /></button>)}</div></section> : <div className="flex h-64 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100 to-amber-100 text-6xl" aria-label="No photos yet">✈️</div>}
    {images.length > 1 && <div className="mt-3 flex justify-center gap-2 md:hidden">{images.map((_, index) => <button aria-label={`Show photo ${index + 1}`} className={`h-2.5 w-2.5 rounded-full ${index === activeImage ? "bg-rose-600" : "bg-gray-300"}`} key={index} onClick={() => setActiveImage(index)} />)}</div>}
    {editingPlace && <EditPlaceForm key={place.id} place={place} onCancel={() => setEditingPlace(false)} onSave={form => mutate(`/api/spots/${place.id}`, "PUT", form, () => setEditingPlace(false))} />}

    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem]">
      <div className="space-y-8">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7"><div className="flex items-center justify-between"><div><h2 className="text-2xl font-bold">Stays</h2><p className="text-gray-500">When you were here—or when you are going.</p></div><button className={button} onClick={() => setStayForm({})}>Add Stay</button></div>{stayForm && <StayForm key={stayForm.id || "new"} stay={stayForm.id ? stayForm : null} onCancel={() => setStayForm(false)} onSave={saveStay} />}<div className="mt-5 divide-y divide-gray-100">{stays.map(stay => <article className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between" key={stay.id}><div><p className="font-bold">{formatDate(stay.startDate)} – {formatDate(stay.endDate)}</p><p className="text-sm text-gray-500">{stay.endDate < todayISO() ? "Completed" : "Upcoming"}</p></div><div className="flex gap-3"><button className="font-semibold text-rose-600" onClick={() => setStayForm(stay)}>Edit</button><button className="font-semibold text-red-600" onClick={() => window.confirm("Delete this Stay?") && mutate("/api/bookings/delete", "DELETE", { id: stay.id })}>Delete</button></div></article>)}{!stays.length && <p className="py-5 text-gray-500">No Stays recorded yet.</p>}</div></section>
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7"><div className="flex items-center justify-between"><div><h2 className="text-2xl font-bold">Memories</h2><p className="text-gray-500">The moments worth keeping.</p></div><button className={button} onClick={() => setMemoryForm({})}>Add Memory</button></div>{memoryForm && <MemoryForm key={memoryForm.id || "new"} memory={memoryForm.id ? memoryForm : null} onCancel={() => setMemoryForm(false)} onSave={saveMemory} />}<div className="mt-5 space-y-4">{memories.map(memory => <article className="rounded-xl bg-gray-50 p-5" key={memory.id}><div className="flex justify-between gap-4"><p className="text-amber-500" aria-label={`${memory.rating} out of 5 stars`}>{"★".repeat(memory.rating)}<span className="text-gray-300">{"★".repeat(5 - memory.rating)}</span></p><div className="flex gap-3"><button className="font-semibold text-rose-600" onClick={() => setMemoryForm(memory)}>Edit</button><button className="font-semibold text-red-600" onClick={() => window.confirm("Delete this Memory?") && mutate("/api/reviews/delete", "DELETE", { id: memory.id })}>Delete</button></div></div><p className="mt-3 leading-7 text-gray-700">{memory.review}</p></article>)}{!memories.length && <p className="text-gray-500">No Memories recorded yet.</p>}</div></section>
      </div>
      <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24"><h2 className="text-xl font-bold">Collections</h2><p className="mt-1 text-sm text-gray-500">Add this Place to your lists.</p><div className="mt-4">{collections.map(collection => { const included = Object.values(collection.wishspots || {}).some(member => member.spotId === place.id); return <label className="flex min-h-[44px] items-center gap-3" key={collection.id}><input className="h-5 w-5" type="checkbox" checked={included} onChange={() => mutate(included ? "/api/wishspots/delete" : "/api/wishspots/create", included ? "DELETE" : "POST", { wishlistId: collection.id, spotId: place.id })} />{collection.name}</label>; })}{!collections.length && <p className="text-sm text-gray-500">Create a Collection first.</p>}</div><Link className="mt-5 inline-block font-semibold text-rose-600" to="/collections">Manage Collections →</Link></aside>
    </div>
  </main>;
}

export default SpotPage;
