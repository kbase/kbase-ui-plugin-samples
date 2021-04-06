import { configureMockStore } from "@jedmao/redux-mock-store";
import { StoreState } from "redux/store";
import { AppAction } from "redux/actions";

export default configureMockStore<
  StoreState,
  AppAction
>();
