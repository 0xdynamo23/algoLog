import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: { user: userReducer },
});

// persist user to localStorage
store.subscribe(() => {
  const state = store.getState() as any;
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(state.user));
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store; 