import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { thunkGetWishlists } from "../../../store/wishlists";
import { useClickOutside } from "../../../App";
import EditWishlistModal from "../../Elements/EditWishlistModal";
import WishlistSpot from "../../Elements/WishlistSpots";

function WishlistPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const url = useParams();
  const [formDisplay, setFormDisplay] = useState(false);

  useEffect(() => {
    dispatch(thunkGetWishlists(user.id));
  }, [dispatch, user.id]);

  const wishlist = useSelector((state) => state.wishlists[url.wishlistId]);
  const spots = useSelector((state) => state.spots);

  const popupRef = useClickOutside(() => {
    setFormDisplay(false);
  });

  const copy = () => {
    navigator.clipboard.writeText(window.location.href);
  };
  let lSpots;
  if (wishlist) lSpots = Object.values(wishlist.wishspots);

  return (
    <>
      {wishlist && spots ? (
        <>
          <div className={'flex min-h-[calc(100vh-96px)] flex-col lg:flex-row'}>
            <div
              style={{ marginTop: "2%" }}
              className={'w-full px-4 py-4 sm:px-8 lg:w-1/2'}
            >
              <div className={'flex items-center justify-between'}>
                <div onClick={() => history.push("/my-wishlists")}>
                  <img
                    className={'h-9 w-9 cursor-pointer rounded-full p-2 hover:bg-gray-100'}
                    alt="back"
                    src="/static/backArrow.svg"
                  />
                </div>
                <div className={'flex gap-3'}>
                  <div onClick={copy}>
                    <img
                      className={'h-9 w-9 cursor-pointer rounded-full p-2 hover:bg-gray-100'}
                      alt="copy"
                      src="/static/copy.svg"
                    />
                  </div>
                  <div onClick={() => setFormDisplay(true)}>
                    <img
                      className={'h-9 w-9 cursor-pointer rounded-full p-2 hover:bg-gray-100'}
                      alt="menu"
                      src="/static/threedot.svg"
                    />
                  </div>
                </div>
              </div>
              <div className={'my-6 text-4xl font-bold'}>{wishlist.name}</div>
              <div className={'space-y-6 overflow-y-auto'}>
                {lSpots.length > 0 ? (
                  lSpots.map((spot, i) => {
                    return (
                      <div key={i}>
                        <WishlistSpot
                          id={spot.id}
                          spot={spots[spot.spotId]}
                          wishlistId={url.wishlistId}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div>There are no spots in this list</div>
                )}
              </div>
            </div>
            <div className={'hidden min-h-[calc(100vh-96px)] w-1/2 bg-gray-100 lg:block'}>
              <img
                alt="Map coming soon"
                className={'h-full w-full object-cover'}
                src="/static/coming_soon.png"
              />
            </div>
          </div>
          <EditWishlistModal
            innerRef={popupRef}
            formDisplay={formDisplay}
            setFormDisplay={setFormDisplay}
            wishlistId={url.wishlistId}
            listname={wishlist.name}
          />
        </>
      ) : null}
    </>
  );
}

export default WishlistPage;
