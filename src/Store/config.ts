import { createStore } from "redux";
import { rootReducer } from "./combine";

export const store = createStore(rootReducer)