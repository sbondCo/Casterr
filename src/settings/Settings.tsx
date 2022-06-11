import { store, RootState } from "@/app/store";
import DropDown from "@/common/DropDown";
import TextBox from "@/common/TextBox";
import TickBox from "@/common/TickBox";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch, useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import General from "./pages/General";
import Recording from "./pages/Recording";
import {
  setDeleteVideoConfirmationDisabled,
  setDeleteVideosFromDisk,
  setRcStatusAlsoStopStart,
  setRcStatusDblClkToRecord,
  setStartupPage
} from "./settingsSlice";
import { Page } from "./types";

export default function Settings() {
  const state = useSelector((store: RootState) => store.settings);
  const dispatch = useDispatch();

  return (
    <div>
      <ul className="flex row justify-center items-center my-4 text-xl">
        <SettingsNavItem text="General" />
        <SettingsNavItem text="Recording" />
        <SettingsNavItem text="Key Bindings" />
      </ul>

      <Switch>
        <Route exact path="/settings">
          {/* Redirect to general settings - the default */}
          <Redirect to="/settings/general" />
        </Route>

        <Route path="/settings/general">
          <General />
        </Route>

        <Route path="/settings/recording">
          <Recording />
        </Route>

        <Route path="/settings/keybindings">
          <span>Key Bindings Not Implemented</span>
        </Route>
      </Switch>
    </div>
  );
}

// TODO: Move this to its own component file, it can be reused for videos page with some editing
// maybe have it included in main app then if a route includes data for diff pages, show it?
function SettingsNavItem(props: { text: string }) {
  const to = props.text.replace(" ", "").toLowerCase();
  const active = useLocation().pathname.replace("/settings/", "").toLowerCase() == to;

  return (
    <NavLink
      to={to}
      className={["mx-2", active ? `text-white-100 text-1xl` : `text-white-25 hover:text-white-50`].join(" ")}
    >
      <span className={`cursor-pointer`}>{props.text}</span>
      <div className={["h-0.5", active ? "rounded-full bg-white-100" : ""].join(" ")}></div>
    </NavLink>
  );
}
