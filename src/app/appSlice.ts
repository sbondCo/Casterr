import { type PopupOptions } from "@/libs/helpers/notifications";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  popups: PopupOptions[];
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
    },
    /**
     * Remove popup from state. Accepts popup id.
     */
    popupRemoved: (state, action: PayloadAction<string | number>) => {
      state.popups = state.popups.filter((p) => p.id !== action.payload);
    }
  }
});

export const { popupCreated, popupRemoved } = appSlice.actions;

export default appSlice.reducer;
