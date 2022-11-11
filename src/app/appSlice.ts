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
      if (!state.popups.find((p) => p.id === action.payload.id)) {
        state.popups.push(action.payload);
      } else {
        state.popups = state.popups.map((p) => {
          if (p.id === action.payload.id) {
            return action.payload;
          }
          return p;
        });
      }
    }
  }
});

export const { popupCreated } = appSlice.actions;

export default appSlice.reducer;
