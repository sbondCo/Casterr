import Dragger from "@/app/Dragger";
import Nav from "@/app/Nav";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { store } from "@/app/store";
import { Provider } from "react-redux";
import DesktopNotification from "@/common/DesktopNotification";
import React, { Suspense } from "react";

function App() {
  const Videos = React.lazy(() => import("@/videos"));
  const Editor = React.lazy(() => import("@/editor"));
  const Settings = React.lazy(() => import("@/settings"));
  const path = window.location.pathname;
  const isDNotifRoute = path.includes("/dnotif");

  return (
    <div
      className={`App bg-primary-100 text-white-100 min-h-screen max-h-screen overflow-hidden ${
        isDNotifRoute && "rounded-xl"
      }`}
    >
      <Provider store={store}>
        <Router>
          {!isDNotifRoute && (
            <>
              <Dragger />
              <Nav />
            </>
          )}

          <Suspense fallback={<div>Loading</div>}>
            <Switch>
              <Route exact path="/">
                <Redirect to="/videos" />
              </Route>

              <Route path="/videos">
                <Videos />
              </Route>

              <Route path="/editor">
                <Editor />
              </Route>

              <Route path="/settings">
                <Settings />
              </Route>

              <Route path={"/dnotif/:icon/:desc"}>
                <DesktopNotification />
              </Route>
            </Switch>
          </Suspense>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
