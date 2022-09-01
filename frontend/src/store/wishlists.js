import { CREATE_WISHSPOT } from "./wishspots";
const GET_WISHLIST = "wishlists/GET_WISHLISTS";
const CREATE_WISHLIST = "wishlists/CREATE_WISHLIST";
const UPDATE_WISHLIST = "wishlists/UPDATE_WISHLIST";
const LOGOUT_LISTS = "wishlists/LOGOUT_LISTS";
const DELETE_LIST = "wishlists/DELETE_LIST";

const actionGetWishlists = (wishlists) => ({
  type: GET_WISHLIST,
  wishlists,
});

const actionCreateWishlists = (wishlist) => ({
  type: CREATE_WISHLIST,
  wishlist,
});

const actionUpdateWishlist = (wishlist) => ({
  type: UPDATE_WISHLIST,
  wishlist,
});

const actionLogoutLists = () => {
  return {
    type: LOGOUT_LISTS,
  };
};

const actionDeleteList = (listId) => {
  return {
    type: DELETE_LIST,
    listId,
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

export const thunkUpdateWishlist = (wishlist) => async (dispatch) => {
  const response = await fetch(`/api/wishlists/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(wishlist),
  });

  if (response.ok) {
    const wishlist = await response.json();
    dispatch(actionUpdateWishlist(wishlist));
  }
};
export const thunkDeleteWishlist = (wishlistId) => async (dispatch) => {
  const response = await fetch(`/api/wishlists/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(wishlistId),
  });

  if (response.ok) {
    dispatch(actionDeleteList(wishlistId));
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
      wishlist.wishspots = {};
      newState[wishlist.id] = wishlist;
      return newState;
    }

    case UPDATE_WISHLIST: {
      const { wishlist } = action;
      newState[wishlist.id].name = wishlist.name;
      return newState;
    }
    case DELETE_LIST: {
      const id = action.listId;
      delete newState[id];
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
