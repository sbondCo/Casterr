import { type RootState } from "@/app/store";
import TickBox from "@/common/TickBox";
import { useDispatch, useSelector } from "react-redux";
import NamedContainer from "../../common/NamedContainer";
import {
  setDeleteVideoConfirmationDisabled,
  setDeleteVideosFromDisk,
  setRcStatusAlsoStopStart,
  setRcStatusDblClkToRecord
} from "./../settingsSlice";

export default function General() {
  const state = useSelector((store: RootState) => store.settings.general);
  const dispatch = useDispatch();

  return (
    <>
      <NamedContainer title="Recording Status Also Stop/Start Recording" row>
        <TickBox ticked={state.rcStatusAlsoStopStart} onChange={(t) => dispatch(setRcStatusAlsoStopStart(t))} />
      </NamedContainer>

      <NamedContainer title="Recording Status Double Click To Record" row>
        <TickBox ticked={state.rcStatusDblClkToRecord} onChange={(t) => dispatch(setRcStatusDblClkToRecord(t))} />
      </NamedContainer>

      <NamedContainer title="Disable Delete Video Confirmation" row>
        <TickBox
          ticked={state.deleteVideoConfirmationDisabled}
          onChange={(t) => dispatch(setDeleteVideoConfirmationDisabled(t))}
        />
      </NamedContainer>

      <NamedContainer title="Delete Videos From Disk By Default" row>
        <TickBox ticked={state.deleteVideosFromDisk} onChange={(t) => dispatch(setDeleteVideosFromDisk(t))} />
      </NamedContainer>
    </>
  );
}
