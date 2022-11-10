import { PopupOptions } from "@/libs/helpers/notifications";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  popups: Array<PopupOptions>;
}

const appSlice = createSlice({
  name: "app",
  initialState: { popups: [] } as AppState,
  reducers: {
    popupCreated: (state, action: PayloadAction<PopupOptions>) => {
      state.popups.push(action.payload);
    }
  }
});

export const { popupCreated } = appSlice.actions;

export default appSlice.reducer;
