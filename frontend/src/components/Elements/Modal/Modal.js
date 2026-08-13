import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkCreateWishlist } from "../../../store/wishlists";
import ListCards from "../ListCards";

function Modal({
  display,
  setDisplay,
  innerRef,
  formDisplay,
  setFormDisplay,
  setFilled,
  spot,
}) {
  let user = useSelector((state) => state.session.user);
  let listsObj = useSelector((state) => state.wishlists);
  let lists = Object.values(listsObj);
  const [name, setName] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    let data = {
      userId: user.id,
      name,
    };
    e.preventDefault();
    dispatch(thunkCreateWishlist(data));
    setFormDisplay(false);
    setDisplay(true);
  };

  return (
    <>
      {display ? (
        <div className={'fixed inset-0 z-30 flex items-center justify-center bg-gray-900/40 p-4'}>
          <div ref={innerRef} className={'max-h-[80vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl'}>
            <div className={'flex items-center justify-between border-b border-gray-200 px-5 py-4'}>
              <div
                onClick={() => setDisplay(false)}
                className={'flex h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:bg-gray-100'}
              >
                <img className={'h-4 w-4'} alt="x" src="/media/x.svg" />
              </div>
              <strong>Your Wishlists</strong>
              <div className={'h-4 w-4'}></div>
            </div>
            <div
              className={'flex cursor-pointer items-center gap-4 px-5 py-3 hover:bg-gray-50'}
              onClick={() => {
                setDisplay(false);
                setFormDisplay(true);
              }}
            >
              <div className={'flex h-14 w-14 flex-none items-center justify-center rounded-xl border border-gray-300'}>
                <img
                  className={'h-5 w-5'}
                  alt="plus"
                  src="/media/plus.svg"
                />
              </div>
              <strong className={'font-semibold'}>Create new wishlist</strong>
            </div>
            {lists.map((list, i) => {
              return (
                <ListCards
                  key={i}
                  list={list}
                  setFilled={setFilled}
                  setDisplay={setDisplay}
                  spot={spot}
                />
              );
            })}
          </div>
        </div>
      ) : null}
      {formDisplay ? (
        <div className={'fixed inset-0 z-30 flex items-center justify-center bg-gray-900/40 p-4'}>
          <div ref={innerRef} className={'max-h-[80vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl'}>
            <div className={'flex items-center justify-between border-b border-gray-200 px-5 py-4'}>
              <div
                onClick={() => setFormDisplay(false)}
                className={'flex h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:bg-gray-100'}
              >
                <img className={'h-4 w-4'} alt="x" src="/media/x.svg" />
              </div>
              <strong>Name this wishlist</strong>
              <div className={'h-4 w-4'}></div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className={'p-5'}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={'h-12 w-full rounded-lg border border-gray-300 px-3'}
                ></input>
                <p className={'mt-1 text-xs text-gray-500'}>50 characters maximum</p>
              </div>
              <div className={'border-t border-gray-200 p-5'}>
                {name.length > 0 && name.length < 50 ? (
                  <button className={'h-11 w-full rounded-lg bg-rose-500 font-bold text-white hover:bg-rose-600'}>Create</button>
                ) : (
                  <div className={'flex h-11 w-full cursor-not-allowed items-center justify-center rounded-lg bg-gray-300 font-bold text-white'}> Create</div>
                )}
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Modal;
