import Icon, { Icons } from "@/common/Icon";
import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <nav className="relative flex items-center justify-center h-12 min-h-full bg-secondary-100">
      <ul className="flex flex-row flex-nowrap">
        <NavItem text="videos" icon="play" />
        <NavItem text="settings" icon="settings" />
      </ul>

      {/* Recording Status */}
      <ul className="absolute right-5 flex flex-row flex-nowrap items-center gap-3">
        <div className="" title="Recording duration">
          01:12:52
        </div>
        <div
          className={`h-6 w-6 rounded-3xl bg-red-100 shadow-[_0_0_8px_theme('colors.red.100')] cursor-pointer`}
          title={`Start/Stop Recording\n\nWhite => Idle\nRed => Recording`}
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
