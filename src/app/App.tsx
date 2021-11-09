import Nav from "@/app/Nav";
import Videos from "@/videos";
import Settings from "@/settings";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { store } from "@/app/store";
import { Provider } from "react-redux";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Router>
          <Nav />

          <Switch>
            <Route path="/videos">
              <Videos />
            </Route>

            <Route path="/settings">
              <Settings />
            </Route>
          </Switch>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
