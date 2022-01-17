import { createStore } from "redux";

import rootReducer from "../redux/allReducers";

const store =createStore(rootReducer);

export default store;

