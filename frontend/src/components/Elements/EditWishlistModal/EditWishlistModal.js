import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkUpdateWishlist } from "../../../store/wishlists";
import ConfirmDelete from "../ConfirmDelete";
import { useClickOutside } from "../../../App";

function EditWishlistModal({
  innerRef,
  formDisplay,
  setFormDisplay,
  wishlistId,
  listname,
}) {
  const dispatch = useDispatch();
  const [name, setName] = useState(listname);
  const [display, setDisplay] = useState(false);

  const handleSubmit = (e) => {
    let data = {
      id: wishlistId,
      name,
    };

    dispatch(thunkUpdateWishlist(data));
    setFormDisplay(false);
  };
  const confirmRef = useClickOutside(() => {
    setDisplay(false);
    setFormDisplay(true);
  });

  return (
    <>
      {formDisplay ? (
        <div className={'fixed inset-0 z-30 flex items-center justify-center bg-gray-900/40 p-4'}>
          <div ref={innerRef} className={'max-h-[80vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl'}>
            {display ? (
              <ConfirmDelete
                confirmRef={confirmRef}
                setDisplay={setDisplay}
                name={name}
                id={wishlistId}
              />
            ) : (
              <>
                <div className={'flex items-center justify-between border-b border-gray-200 px-5 py-4'}>
                  <div
                    onClick={() => setFormDisplay(false)}
                    className={'flex h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:bg-gray-100'}
                  >
                    <img alt="Close" className={'h-4 w-4'} src="/static/x.svg" />
                  </div>
                  <strong>Settings</strong>
                  <div
                    className={'cursor-pointer rounded-lg px-3 py-2 text-rose-600 hover:bg-rose-50'}
                    onClick={() => {
                      setDisplay(true);
                    }}
                  >
                    <strong>Delete</strong>
                  </div>
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
                  <div className={'flex items-center justify-between border-t border-gray-200 p-5'}>
                    <div
                      className={'cursor-pointer rounded-lg px-3 py-2 hover:bg-gray-100'}
                      onClick={() => setFormDisplay(false)}
                    >
                      <strong className={'underline'}>Cancel</strong>
                    </div>
                    {name.length > 0 && name.length < 50 ? (
                      <button
                        onClick={handleSubmit}
                        className={'h-11 rounded-lg bg-rose-500 px-6 font-bold text-white hover:bg-rose-600'}
                      >
                        Save
                      </button>
                    ) : (
                      <div className={'flex h-11 cursor-not-allowed items-center rounded-lg bg-gray-300 px-6 font-bold text-white'}>Save</div>
                    )}
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

export default EditWishlistModal;
