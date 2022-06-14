import SubNav, { SubNavItem } from "@/common/SubNav";
import { Redirect, Route, Switch } from "react-router-dom";

export default function Videos() {
  return (
    <div>
      <SubNav>
        <SubNavItem text="Recordings" />
        <SubNavItem text="Clips" />
      </SubNav>

      <Switch>
        <Route exact path="/videos">
          {/* Redirect to recordings - the default */}
          <Redirect to="/videos/recordings" />
        </Route>

        <Route path="/videos/recordings">
          <span>Recordings</span>
        </Route>

        <Route path="/videos/clips">
          <span>Clips</span>
        </Route>
      </Switch>
    </div>
  );
}
