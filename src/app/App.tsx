import Dragger from "@/app/Dragger";
import Nav from "@/app/Nav";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { store } from "@/app/store";
import { Provider } from "react-redux";
import DesktopNotification from "@/common/DesktopNotification";
import React, { Suspense } from "react";
import Init from "./Init";

export default function App() {
  const Videos = React.lazy(async () => await import("@/videos"));
  const Editor = React.lazy(async () => await import("@/editor"));
  const Settings = React.lazy(async () => await import("@/settings"));
  const path = window.location.pathname;
  const isDNotifRoute = path.includes("/dnotif");

  return (
    <div
      className={`App bg-primary-100 text-white-100 min-h-screen max-h-screen overflow-hidden ${
        isDNotifRoute ? "rounded-xl" : ""
      }`}
    >
      <Provider store={store}>
        <Router>
          {!isDNotifRoute && (
            <>
              <Init />
              <Dragger />
              <Nav />
            </>
          )}

          <Suspense fallback={<div>Loading</div>}>
            <Routes>
              <Route path="/" element={<Navigate replace to="/videos" />} />
              <Route path="/videos/*" element={<Videos />} />
              <Route path="/editor" element={<Editor />} />
              <Route path="/settings/*" element={<Settings />} />
              <Route path={"/dnotif/:icon/:desc"} element={<DesktopNotification />} />
            </Routes>
          </Suspense>
        </Router>
      </Provider>
    </div>
  );
}
