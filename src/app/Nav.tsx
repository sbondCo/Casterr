import Icon, { Icons } from "@/common/Icon";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "./store";
import Recorder from "@/libs/recorder";
import { toReadableTimeFromSeconds } from "@/libs/helpers/extensions/number";
import { useEffect } from "react";
import { incrementElapsed, resetElapsed } from "@/libs/recorder/recorderSlice";

export default function Nav() {
  const state = useSelector((store: RootState) => store.recorder);
  const dispatch = useDispatch();
  const statusColClasses = state.isRecording
    ? "bg-red-100 shadow-[_0_0_8px_theme('colors.red.100')]"
    : "bg-white-100 shadow-[_0_0_8px_theme('colors.white.100')]";

  useEffect(() => {
    let timeElapsedSI: NodeJS.Timer | undefined;

    if (state.isRecording) {
      timeElapsedSI = setInterval(() => {
        dispatch(incrementElapsed());
      }, 1000);
    } else {
      dispatch(resetElapsed());
      if (timeElapsedSI !== undefined) clearInterval(timeElapsedSI);
    }

    return () => {
      clearInterval(timeElapsedSI);
    };
  }, [state.isRecording]);

  return (
    <nav className="relative flex items-center justify-center h-12 min-h-full bg-secondary-100">
      <ul className="flex flex-row flex-nowrap">
        <NavItem text="videos" icon="play" />
        <NavItem text="settings" icon="settings" />
      </ul>

      {/* Recording Status */}
      <ul className="absolute right-5 flex flex-row flex-nowrap items-center gap-3">
        {state.isRecording && <div title="Recording duration">{toReadableTimeFromSeconds(state.timeElapsed)}</div>}
        <div
          className={`h-6 w-6 rounded-3xl cursor-pointer transition-shadow ${statusColClasses}`}
          title={`Start/Stop Recording\n\nWhite => Idle\nRed => Recording`}
          onClick={async () => await Recorder.auto()}
        ></div>
      </ul>
    </nav>
  );
}

/**
 * Text doubles as the link to go to. Add another prop if more specific urls need to be used.
 */
function NavItem(props: { text: string; icon: Icons }) {
  const { text, icon } = props;

  return (
    <li>
      <Link
        to={`/${text}`}
        className="flex flex-row items-center justify-center py-2 sm:py-0.5 px-4 mx-1.5
          bg-primary-100 rounded text-white-100 fill-current hover:bg-tertiary-100
          transition-colors ease-in-out duration-250 text-xl"
      >
        <Icon i={icon} className="mr-0 sm:mr-1.5" wh={16} />
        <span className="capitalize hidden sm:flex">{text}</span>
      </Link>
    </li>
  );
}
