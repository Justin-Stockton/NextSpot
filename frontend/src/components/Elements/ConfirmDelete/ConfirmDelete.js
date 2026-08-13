import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { thunkDeleteWishlist } from "../../../store/wishlists";

function ConfirmDelete({ setDisplay, confirmRef, name, id }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const handleDelete = async (e) => {
    e.preventDefault();
    await dispatch(thunkDeleteWishlist(id));

    history.push("/my-wishlists");
  };
  return (
    <>
      <div ref={confirmRef}>
        <div className={'flex items-center justify-between border-b border-gray-200 px-5 py-4'}>
          <div className={'flex h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:bg-gray-100'} onClick={() => setDisplay(false)}>
            <img alt="Back" className={'h-4 w-4'} src="/media/backArrow.svg" />
          </div>
          <strong>Delete this wishlist?</strong>
          <div className={'w-9'}></div>
        </div>
        <div className={'px-5 py-8 text-center'}>
          Are you sure you want to delete {name}?
        </div>
        <div className={'flex justify-between border-t border-gray-200 p-5'}>
          <div
            className={'cursor-pointer rounded-lg px-4 py-2 hover:bg-gray-100'}
            onClick={() => setDisplay(false)}
          >
            <strong className={'underline'}>Cancel</strong>
          </div>
          <button onClick={handleDelete} className={'rounded-lg bg-rose-500 px-5 py-2 font-bold text-white hover:bg-rose-600'}>
            Yes, delete
          </button>
        </div>
      </div>
    </>
  );
}

export default ConfirmDelete;
