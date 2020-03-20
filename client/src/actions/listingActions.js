import { GET_LISTINGS, ADD_LISTING, DELETE_LISTING } from "./types";

export const getListings = () => {
  return {
    type: GET_LISTINGS
  };
};
