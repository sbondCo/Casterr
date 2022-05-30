import Dragger from "@/app/Dragger";
import Nav from "@/app/Nav";
import Videos from "@/videos";
import Settings from "@/settings";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { store } from "@/app/store";
import { Provider } from "react-redux";

function App() {
  return (
    <div className="App bg-primary-100 text-white-100 min-h-screen">
      <Provider store={store}>
        <Router>
          <Dragger />
          <Nav />

          <div className="flex justify-center">
            <div className="sm:w-full" style={{ width: "500px" }}>
              <Switch>
                <Route exact path="/">
                  <Redirect to="/videos" />
                </Route>

                <Route path="/videos">
                  <Videos />
                </Route>

                <Route path="/settings">
                  <Settings />
                </Route>
              </Switch>
            </div>
          </div>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
