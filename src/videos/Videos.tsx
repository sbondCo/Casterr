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
          <div className="relative rounded-md overflow-hidden cursor-pointer">
            <img src="secfile:///home/sbondo/Pictures/SpaceIMG.jpg" alt="" />

            <p className="absolute right-3 top-2 italic font-bold [text_shadow:_1px_1px_black]">30 FPS</p>

            <div className="flex items-center absolute bottom-0 w-full px-3 py-1.5 bg-quaternary-100/60">
              <span className="font-bold">6.5.2021 - 14.13.2</span>
              <span className="ml-auto mr-3 text-sm">03:45</span>
              <span className="text-sm">52 MB</span>
            </div>
          </div>
        </Route>

        <Route path="/videos/clips">
          <span>Clips</span>
        </Route>
      </Switch>
    </div>
  );
}
