import axios from "axios";
import { GET_LISTINGS, ADD_LISTING, DELETE_LISTING } from "./types";

export const getListings = () => dispatch => {
  axios
    .get("/api/listings")
    .then(res => dispatch({ type: GET_LISTINGS, payload: res.data }));
};

export const deleteListing = id => {
  return {
    type: DELETE_LISTING,
    payload: id
  };
};
