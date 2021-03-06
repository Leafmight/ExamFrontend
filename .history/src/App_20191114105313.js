import React, { useState, useEffect } from "react";
import facade from "./apiFacade";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Route, NavLink, Switch } from "react-router-dom";

function LogIn({ logIn }) {
  const init = { username: "", password: "" };
  const [loginCredentials, setLoginCredentials] = useState(init);

  const performLogin = evt => {
    evt.preventDefault();
    logIn(loginCredentials.username, loginCredentials.password);
  };
  const onChange = evt => {
    setLoginCredentials({
      ...loginCredentials,
      [evt.target.id]: evt.target.value
    });
  };
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={performLogin} onChange={onChange}>
        <input placeholder="User Name" id="username" />
        <input placeholder="Password" id="password" />
        <button>Login</button>
      </form>
    </div>
  );
}
const Header = () => {
  if (facade.getRole() === "admin") {
    return (
      <ul className="header">
        <li>
          <NavLink activeClassName="active" to="/home">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/people">
            People
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/company">
            Company
          </NavLink>
        </li>

        <li>
          <NavLink activeClassName="active" to="/log-out">
            Log out
          </NavLink>
        </li>
      </ul>
    );
  }
  return (
    <ul className="header">
      <li>
        <NavLink exact activeClassName="active" to="/home">
          Home
        </NavLink>
      </li>

      <li>
        <NavLink activeClassName="active" to="/company">
          Company
        </NavLink>
      </li>

      <li>
        <NavLink activeClassName="active" to="/log-out">
          Log out
        </NavLink>
      </li>
    </ul>
  );
};
const Content = props => {
  return (
    <Switch>
      <Route exact path="/">
        <Home fetchData={props.fetchData} fetchPeople={props.fetchPeople} />
      </Route>
      <Route path="/products">
        <Products />
      </Route>
      <Route path="/company">
        <Company />
      </Route>

      <Route path="/">
        <App logIn={props.logIn} logOut={props.logOut} />
      </Route>

      <Route path="/log-out">
        <Logout />
      </Route>
      <Route path="*">
        <NoMatch />
      </Route>
    </Switch>
  );
};
const LoggedIn = () => {
  return (
    <div>
      <Router>
        <Header />
      </Router>
    </div>
  );
};

function App({ logIn, logOut }) {
  const [loggedIn, setLoggedIn] = useState(false);

  const logout = () => {
    logOut();
    setLoggedIn(false);
  };
  const login = (user, password) => {
    logIn(user, password).then(res => setLoggedIn(true));
  };

  return (
    <div>
      {!loggedIn ? (
        <LogIn login={login} />
      ) : (
        <div>
          <LoggedIn />
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
}

function Home({ fetchPeople, fetchData }) {
  const [dataFromServer, setDataFromServer] = useState("Fetching...");
  const [listPeople, setListPeople] = useState("");
  useEffect(() => {
    fetchData().then(res => setDataFromServer(res.msg));
  }, []);
  useEffect(() => {
    fetchPeople().then(res => setListPeople(res));
  }, []);

  return (
    <div>
      <h2>Data Received from server</h2>
      <h3>{dataFromServer}</h3>
    </div>
  );
}
const NoMatch = () => <div>No match for path</div>;
const Products = () => (
  <div>
    <h2>Products</h2>
  </div>
);
const Company = () => (
  <div>
    <h2>Company</h2>
  </div>
);
const Logout = () => {};
export default App;
