import Nav from "@/components/Nav";
import Videos from "@/views/Videos";
import Settings from "@/views/Settings";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
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
    </div>
  );
}

export default App;
