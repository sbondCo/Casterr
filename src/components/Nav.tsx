import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <nav className="">
      <ul className="flex flex-row flex-nowrap items-center justify-center">
        <li>
          <Link to="/videos">
            {/* <Icon i="play" /> */}
            <span>Videos</span>
          </Link>
        </li>

        <li>
          <Link to="/settings">
            {/* <Icon i="settings" /> */}
            <span>Settings</span>
          </Link>
        </li>

        <li id="status">
          <span className="timeElapsed">{/* {{ timeElapsed }} */}</span>

          {/* <div
          ref="recordingStatus"
          className="circle idle"
          :title="`Start/Stop Recording\n\nWhite => Idle\nRed => Recording`"
          @click="startStopRecording"
        ></div> */}
        </li>
      </ul>
    </nav>
  );
}
