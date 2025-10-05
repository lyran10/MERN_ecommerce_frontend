// store/slices/toastSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ToastType = "success" | "error";

interface ToastState {
  message: string | null;
  type: ToastType;
}

const initialState: ToastState = {
  message: null,
  type: "success",
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<{ message: string; type?: ToastType }>) => {
      state.message = action.payload.message;
      state.type = action.payload.type || "success";
    },
    hideToast: (state) => {
      state.message = null;
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
