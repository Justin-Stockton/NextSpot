export const CREATE_WISHSPOT = "wishspot/CREATE_WISHSPOT";

const actionCreateWishspot = (data) => ({
  type: CREATE_WISHSPOT,
  data,
});

export const thunkCreateWishlist = (wishlist) => async (dispatch) => {
  const response = await fetch(`/api/wishspots/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(wishlist),
  });

  if (response.ok) {
    const wishData = await response.json();
    dispatch(actionCreateWishspot(wishData));
  }
};
