import { cartLength } from "./reducer";
import { combineReducers } from "redux";

const rootReducer=combineReducers({
  cartLength:cartLength,

})

export default rootReducer