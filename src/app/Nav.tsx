import Icon from "@/common/Icon";
import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <nav className="flex items-center justify-center h-12 min-h-full text-2xl bg-secondary-100">
      <ul className="flex flex-row flex-nowrap">
        <NavItem text="videos" icon="play" />
        <NavItem text="settings" icon="settings" />

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

/**
 * Text doubles as the link to go to. Add another prop if more specific urls need to be used.
 */
function NavItem(props: { text: string; icon: string }) {
  const { text, icon } = props;

  return (
    <li>
      <Link
        to={`/${text}`}
        className="flex flex-row items-center justify-center px-5 md:px-3 text-white-100 
          fill-current hover:text-white-50 transition-colors ease-in-out duration-250"
      >
        <Icon i={icon} className="mr-1.5" />
        <span className="capitalize hidden md:flex">{text}</span>
      </Link>
    </li>
  );
}
