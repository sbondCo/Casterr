import { type RootState } from "@/app/store";
import { useDispatch, useSelector } from "react-redux";
import NamedContainer from "../../common/NamedContainer";
import { setAddBookmark, setStartStopRecording, setStartStopRecordingRegion } from "../settingsSlice";
import KeyBindButton from "./KeyBindButton";

export default function KeyBindings() {
  const state = useSelector((store: RootState) => store.settings.key);
  const dispatch = useDispatch();

  return (
    <>
      <NamedContainer title="Start/Stop Recording">
        <KeyBindButton
          name="startStopRecording"
          bind={state.startStopRecording}
          onUpdate={(newBind) => {
            dispatch(setStartStopRecording(newBind));
          }}
        />
      </NamedContainer>
      <NamedContainer title="Start/Stop Recording A Region">
        <KeyBindButton
          name="startStopRecordingRegion"
          bind={state.startStopRecordingRegion}
          onUpdate={(newBind) => {
            dispatch(setStartStopRecordingRegion(newBind));
          }}
        />
      </NamedContainer>
      <NamedContainer title="Add Bookmark To Recording">
        <KeyBindButton
          name="addBookmark"
          bind={state.addBookmark}
          onUpdate={(newBind) => {
            dispatch(setAddBookmark(newBind));
          }}
        />
      </NamedContainer>
    </>
  );
}
