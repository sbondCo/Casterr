import { RootState } from "@/app/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import NamedContainer from "../../common/NamedContainer";
import { setStartStopRecording } from "../settingsSlice";
import KeyBindButton from "./KeyBindButton";

export default function KeyBindings() {
  const state = useSelector((store: RootState) => store.settings.key);
  const dispatch = useDispatch();

  return (
    <>
      <NamedContainer title="Start/Stop Recording">
        <KeyBindButton
          bind={state.startStopRecording}
          onUpdate={(newBind) => {
            dispatch(setStartStopRecording(newBind));
          }}
        />
      </NamedContainer>
    </>
  );
}
