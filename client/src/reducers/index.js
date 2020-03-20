import { combineReducers } from "redux";
import listingReducer from "./listingReducer";

export default combineReducers({
  listing: listingReducer
});
