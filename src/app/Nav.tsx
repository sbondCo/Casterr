import Icon, { type Icons } from "@/common/Icon";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { type RootState } from "./store";
import Recorder from "@/libs/recorder";
import { toReadableTimeFromSeconds } from "@/libs/helpers/extensions/number";
import { useEffect } from "react";
import { incrementElapsed, resetElapsed } from "@/libs/recorder/recorderSlice";
import { ipcRenderer } from "electron";

export default function Nav() {
  const state = useSelector((store: RootState) => store.recorder);
  const genSettingsState = useSelector((store: RootState) => store.settings.general);
  const dispatch = useDispatch();
  const statusColClasses =
    state.recordingStatus === 1
      ? "bg-red-100 shadow-[_0_0_8px_theme('colors.red.100')]"
      : "bg-white-100 shadow-[_0_0_8px_theme('colors.white.100')]";

  useEffect(() => {
    let timeElapsedSI: NodeJS.Timer | undefined;

    if (state.recordingStatus === 1) {
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
  }, [state.recordingStatus]);

  return (
    <nav
      className="relative flex items-center justify-center h-12 min-h-full bg-secondary-100"
      style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
    >
      {/* Recording Status */}
      <ul
        className="absolute left-5 flex flex-row flex-nowrap items-center gap-3"
        style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
      >
        <div
          className={`h-6 w-6 rounded-3xl cursor-pointer transition-shadow ${statusColClasses} ${
            state.recordingStatus === 2 ? "animate-pulse" : ""
          }`}
          title={`Start/Stop Recording\n\nWhite => Idle\nRed => Recording`}
          onClick={async () => {
            if (genSettingsState.rcStatusAlsoStopStart && !genSettingsState.rcStatusDblClkToRecord)
              await Recorder.auto(undefined);
          }}
          onDoubleClick={async () => {
            if (genSettingsState.rcStatusAlsoStopStart && genSettingsState.rcStatusDblClkToRecord)
              await Recorder.auto(undefined);
          }}
        ></div>
        {state.recordingStatus === 1 && (
          <div title="Recording duration">{toReadableTimeFromSeconds(state.timeElapsed)}</div>
        )}
      </ul>

      <ul className="flex flex-row flex-nowrap" style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}>
        <NavItem text="videos" icon="play" />
        <NavItem text="settings" icon="settings" />
      </ul>

      <ul
        className="absolute right-3 flex flex-row-reverse gap-3"
        style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
      >
        <WindowActionItem icon="close" />
        <WindowActionItem icon="max" />
        <WindowActionItem icon="min" />
      </ul>
    </nav>
  );
}

/**
 * Text doubles as the link to go to. Add another prop if more specific urls need to be used.
 */
function NavItem(props: { text: string; icon: Icons }) {
  const { text, icon } = props;
  const to = `/${text}`;
  const isActive = useLocation().pathname.startsWith(to);

  return (
    <li>
      <Link
        to={to}
        className={`flex flex-row items-center justify-center py-2 sm:py-0.5 px-4 mx-1.5
          bg-primary-100 rounded text-white-100 fill-current 
          transition-colors ease-in-out duration-250 text-xl ${
            isActive ? "bg-quaternary-100 pointer-events-none" : "hover:bg-tertiary-100"
          }`}
      >
        <Icon i={icon} className="mr-0 sm:mr-1.5" wh={16} />
        <span className="capitalize hidden sm:flex">{text}</span>
      </Link>
    </li>
  );
}

function WindowActionItem(props: { icon: Icons }) {
  const { icon } = props;

  const manageWindow = () => {
    ipcRenderer.send("manage-window", icon);
  };

  return (
    <div
      onClick={manageWindow}
      className={`flex justify-center items-center h-full p-1 rounded text-white-100 cursor-pointer ${
        icon === "close" ? "hover:bg-red-100" : "hover:bg-white-25"
      }`}
    >
      <Icon i={icon} wh={14} />
    </div>
  );
}
