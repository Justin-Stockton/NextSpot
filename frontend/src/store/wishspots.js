export const CREATE_WISHSPOT = "wishspot/CREATE_WISHSPOT";
export const DELETE_WISHSPOT = "wishspot/DELETE_WISHSPOT";

const actionCreateWishspot = (data) => ({
  type: CREATE_WISHSPOT,
  data,
});
const actionDeleteWishspot = (data) => ({
  type: DELETE_WISHSPOT,
  data,
});

export const thunkCreateWishspot = (data) => async (dispatch) => {
  const response = await fetch(`/api/wishspots/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    const wishData = await response.json();
    dispatch(actionCreateWishspot(wishData));
  }
};
export const thunkDeleteWishspot = (data) => async (dispatch) => {
  const response = await fetch(`/api/wishspots/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    dispatch(actionDeleteWishspot(data));
  }
};
