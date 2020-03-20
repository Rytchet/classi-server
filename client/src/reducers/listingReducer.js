import { v4 as uuid } from "uuid";

import { GET_LISTINGS, ADD_LISTING, DELETE_LISTING } from "../actions/types";

const initialState = {
  listings: [
    {
      id: uuid(),
      title: "Title 1"
    },
    {
      id: uuid(),
      title: "Title 2"
    },
    {
      id: uuid(),
      title: "Title 3"
    },
    {
      id: uuid(),
      title: "Title 4"
    }
  ]
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_LISTINGS:
      return {
        ...state
      };
    default:
      return state;
  }
}
