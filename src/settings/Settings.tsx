import { store, RootState } from "@/app/store";
import DropDown from "@/common/DropDown";
import TextBox from "@/common/TextBox";
import TickBox from "@/common/TickBox";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch, useLocation } from "react-router";
import { NavLink } from "react-router-dom";
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
          <SettingsItem title="Startup Page">
            <DropDown
              activeItem={state.general.startupPage}
              items={state.app.pages}
              onChange={(s) => {
                dispatch(setStartupPage(s as Page));
              }}
            />
          </SettingsItem>

          <SettingsItem title="Recording Status Also Stop/Start Recording" row>
            <TickBox
              ticked={state.general.rcStatusAlsoStopStart}
              onChange={(t) => dispatch(setRcStatusAlsoStopStart(t))}
            />
          </SettingsItem>

          <SettingsItem title="Recording Status Double Click To Record" row>
            <TickBox
              ticked={state.general.rcStatusDblClkToRecord}
              onChange={(t) => dispatch(setRcStatusDblClkToRecord(t))}
            />
          </SettingsItem>

          <SettingsItem title="Disable Delete Video Confirmation" row>
            <TickBox
              ticked={state.general.deleteVideoConfirmationDisabled}
              onChange={(t) => dispatch(setDeleteVideoConfirmationDisabled(t))}
            />
          </SettingsItem>

          <SettingsItem title="Delete Videos From Disk By Default" row>
            <TickBox
              ticked={state.general.deleteVideosFromDisk}
              onChange={(t) => dispatch(setDeleteVideosFromDisk(t))}
            />
          </SettingsItem>
        </Route>

        <Route path="/settings/recording">
          <span>Recording</span>
        </Route>

        <Route path="/settings/keybindings">
          <span>Key Bindings</span>
        </Route>
      </Switch>
    </div>
  );
}

interface SettingsItemProps {
  title: string;
  children: React.ReactChild;
  row?: boolean;
}

function SettingsItem({ title, children, row }: SettingsItemProps) {
  const containerClass = row ? "flex flex-row-reverse justify-end" : "";

  return (
    <div className={`mb-5 ${containerClass}`}>
      <p className={`mb-1.5 mr-2.5 font-bold capitalize ${row && "ml-2.5"}`}>{title}</p>
      {children}
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
