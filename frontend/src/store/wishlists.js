const GET_WISHLIST = "wishlists/GET_WISHLISTS";

const actionGetWishlists = (wishlists) => ({
  type: GET_WISHLIST,
  wishlists,
});

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
    default: {
      return state;
    }
  }
};

export default wishlists;
