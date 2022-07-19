import Icon from "@/common/Icon";
import PageLayout from "@/common/PageLayout";
import SubNav, { SubNavItem } from "@/common/SubNav";
import { Redirect, Route, Switch } from "react-router-dom";

export default function Videos() {
  const vids = [0, 1, 2];

  return (
    <PageLayout smPageWidth={false}>
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
          <div className="flex flex-wrap gap-3">
            {vids.map(() => {
              return (
                <div
                  key={Math.random()}
                  className="group flex-grow basis-[100%] md:basis-[40%] lg:basis-[30%] w-3/12 h-64 relative rounded-md overflow-hidden cursor-pointer"
                >
                  <div className="h-full">
                    <img
                      className="w-full h-full object-cover"
                      src="secfile:///home/sbondo/Pictures/SpaceIMG.jpg"
                      alt=""
                    />

                    <div className="group-hover:opacity-100 opacity-0 absolute top-2/4 left-2/4 drop-shadow transition-opacity">
                      <Icon i="edit" />
                    </div>

                    <p className="absolute right-3 top-2 italic font-bold [text_shadow:_1px_1px_black]">30 FPS</p>

                    <div className="flex items-center absolute bottom-0 w-full px-3 py-2 bg-quaternary-100/60">
                      {/* TODO: test this with very long names - clip them */}
                      <span className="font-bold">6.5.2021 - 14.13.2</span>
                      <span className="ml-auto mr-3 text-sm">03:45</span>
                      <span className="text-sm">52 MB</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Route>

        <Route path="/videos/clips">
          <span>Clips</span>
        </Route>
      </Switch>
    </PageLayout>
  );
}
