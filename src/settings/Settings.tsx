import PageLayout from "@/common/PageLayout";
import SubNav, { SubNavItem } from "@/common/SubNav";
import { Redirect, Route, Switch, useLocation } from "react-router";
import General from "./pages/General";
import Recording from "./pages/Recording";

export default function Settings() {
  return (
    <PageLayout>
      <SubNav>
        <SubNavItem text="General" />
        <SubNavItem text="Recording" />
        <SubNavItem text="Key Bindings" />
      </SubNav>

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
    </PageLayout>
  );
}
