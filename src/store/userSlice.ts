import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types";

const loadUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const cached = localStorage.getItem("user");
  if (!cached) return null;
  try {
    return JSON.parse(cached);
  } catch {
    return null;
  }
};

const initialState: User | null = loadUser();

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (_state, action: PayloadAction<User>) => action.payload,
    updateCoins: (state, action: PayloadAction<number>) => {
      if (state) state.coins = action.payload;
    },
    updateSolved: (state, action: PayloadAction<number>) => {
      if (state) state.solved = action.payload;
    },
    updateThemePurchased: (state, action: PayloadAction<boolean>) => {
      if (state) state.themePurchased = action.payload;
    },
    logout: () => null,
  },
});

export const { setUser, updateCoins, updateSolved, updateThemePurchased, logout } = userSlice.actions;
export default userSlice.reducer; 