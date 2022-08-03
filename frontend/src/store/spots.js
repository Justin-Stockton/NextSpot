export const GET_SPOTS = "spots/GET_SPOTS";

const actionGetSpots = (spots) => ({
  type: GET_SPOTS,
  spots,
});

export const thunkGetSpots = () => async (dispatch) => {
  const response = await fetch("/api/spots/", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    const spots = await response.json();
    if (spots.errors) {
      return;
    }

    dispatch(actionGetSpots(spots));
  }
};

const spots = (state = initialState, action) => {
  const newState = JSON.parse(JSON.stringify(state));

  switch (action.type) {
    case GET_SPOTS: {
      const { spots } = action;

      spots.forEach((spot) => {
        newState[spot.id] = spot;
      });

      return newState;
    }

    case LOG_OUT: {
      newState = {};
      return newState;
    }

    default: {
      return state;
    }
  }
};

export default spots;
