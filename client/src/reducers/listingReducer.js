import { GET_LISTINGS, ADD_LISTING, DELETE_LISTING } from "../actions/types";

const initialState = {
  listings: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_LISTINGS:
      return {
        ...state,
        listings: action.payload
      };
    case DELETE_LISTING:
      return {
        ...state,
        items: state.items.filter(listing => listing.id !== action.payload)
      };
    default:
      return state;
  }
}
