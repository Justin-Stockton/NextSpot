export const CREATE_WISHSPOT = "wishspot/CREATE_WISHSPOT";
export const DELETE_WISHSPOT = "wishspot/DELETE_WISHSPOT";

const actionCreateWishspot = (data) => ({
  type: CREATE_WISHSPOT,
  data,
});
const actionDeleteWishspot = (id) => ({
  type: DELETE_WISHSPOT,
  id,
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
export const thunkDeleteWishspot = (id) => async (dispatch) => {
  const response = await fetch(`/api/wishspots/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(id),
  });

  if (response.ok) {
    dispatch(actionDeleteWishspot(id));
  }
};
