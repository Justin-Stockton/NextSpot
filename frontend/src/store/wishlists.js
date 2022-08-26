import { CREATE_WISHSPOT } from "./wishspots";
const GET_WISHLIST = "wishlists/GET_WISHLISTS";
const CREATE_WISHLIST = "wishlists/CREATE_WISHLISTS";
const LOGOUT_LISTS = "wishlists/LOGOUT_LISTS";

const actionGetWishlists = (wishlists) => ({
  type: GET_WISHLIST,
  wishlists,
});

const actionCreateWishlists = (wishlist) => ({
  type: CREATE_WISHLIST,
  wishlist,
});

const actionLogoutLists = () => {
  return {
    type: LOGOUT_LISTS,
  };
};

export const thunkGetWishlists = (userId) => async (dispatch) => {
  const response = await fetch(`/api/wishlists/${userId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const wishlists = await response.json();
    if (wishlists.errors) {
      return;
    }

    dispatch(actionGetWishlists(wishlists));
  }
};

export const thunkCreateWishlist = (wishlist) => async (dispatch) => {
  const response = await fetch(`/api/wishlists/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(wishlist),
  });

  if (response.ok) {
    const wishlists = await response.json();
    dispatch(actionCreateWishlists(wishlists));
  }
};

export const thunkLogoutLists = () => async (dispatch) => {
  await dispatch(actionLogoutLists());
};

const wishlists = (state = {}, action) => {
  let newState = JSON.parse(JSON.stringify(state));

  switch (action.type) {
    case GET_WISHLIST: {
      const { wishlists } = action.wishlists;
      wishlists.forEach((wishlist) => {
        newState[wishlist.id] = wishlist;
      });
      return newState;
    }

    case CREATE_WISHLIST: {
      const { wishlist } = action;
      newState[wishlist.id] = wishlist;
      return newState;
    }
    case CREATE_WISHSPOT: {
      const { data } = action;
      newState[data.wishlistId].wishspots[data.id] = data;
      return newState;
    }
    case LOGOUT_LISTS: {
      newState = {};
      return newState;
    }
    default: {
      return state;
    }
  }
};

export default wishlists;
