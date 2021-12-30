import { useState } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router";
import { NavLink } from "react-router-dom";

export default function Settings() {
  return (
    <div>
      <ul className="flex row justify-center items-center my-4 text-xl">
        <SettingsNavItem text="General" />
        <SettingsNavItem text="Recording" />
        <SettingsNavItem text="Key Bindings" />
      </ul>

      <Switch>
        <Route exact path="/settings">
          <Redirect to="/settings/general" />
        </Route>

        <Route path="/settings/general">
          <span>General</span>
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
