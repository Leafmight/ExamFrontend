import React, { useState, useEffect } from "react";
import facade from "./apiFacade";
import "./App.css";
import {
  HashRouter as Router,
  Route,
  NavLink,
  Link,
  Switch,
  useRouteMatch,
  useHistory,
  useParams
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  let history = useHistory();

  const logout = () => {
    facade.logout();
    setLoggedIn(false);
    history.push("/");
  };
  const login = (user, pass) => {
    facade.login(user, pass).then(res => setLoggedIn(true));
    history.push("/Home");
  };

  return (
    <div>
      {!loggedIn ? (
        <LogIn login={login} />
      ) : (
        <div>
          <LoggedIn logout={logout} />
        </div>
      )}
    </div>
  );
}
function LogIn({ login }) {
  const init = { username: "", password: "" };
  const [loginCredentials, setLoginCredentials] = useState(init);

  const performLogin = evt => {
    evt.preventDefault();
    login(loginCredentials.username, loginCredentials.password);
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
const LoggedIn = ({ logout }) => {
  return (
    <div>
      <Router>
        <Header />
        <Content logout={logout} />
      </Router>
    </div>
  );
};
const Header = () => {
  if (facade.getTokenInfo().roles === "admin") {
    return (
      <ul className="header">
        <li>
          <NavLink activeClassName="active" to="/home">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/allmovies">
            All Movie
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/log-out">
            Log out
          </NavLink>
        </li>
        <li style={{ float: "right" }}>
          <NavLink activeClassName="active" to="/UserInfo">
            {facade.getTokenInfo().roles}
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
        <NavLink activeClassName="active" to="/allmovies">
          All Movie
        </NavLink>
      </li>

      <li>
        <NavLink activeClassName="active" to="/log-out">
          Log out
        </NavLink>
      </li>
      <li style={{ float: "right" }}>
        <NavLink activeClassName="active" to="/UserInfo">
          {facade.getTokenInfo().roles}
        </NavLink>
      </li>
    </ul>
  );
};
const Content = ({ logout }) => {
  return (
    <Switch>
      <Route path="/home">
        <Home />
      </Route>
      <Route path="/allmovies">
        <AllMovies />
      </Route>
      <Route exact path="/">
        <App />
      </Route>
      <Route path="/log-out">
        <Logout logout={logout} />
      </Route>
      <Route path="/UserInfo">
        <UserInfo />
      </Route>
      <Route path="*">
        <NoMatch />
      </Route>
    </Switch>
  );
};

function Home() {
  const [dataFromServer, setDataFromServer] = useState("Fetching...");

  useEffect(() => {
    facade.fetchData().then(res => setDataFromServer(res.msg));
  }, []);

  return (
    <div>
      <h2>Data Received from server</h2>
      <h3>{dataFromServer}</h3>
    </div>
  );
}

const AllMovies = () => {
  const [listMovies, setListMovies] = useState([]);
  useEffect(() => {
    facade.fetchAllMovies().then(res => setListMovies(res));
  }, []);
  return (
    <div>
      <h2>All Movies</h2>
      <p>{JSON.stringify(listMovies)}</p>
      <MovieData listMovies={listMovies} />
    </div>
  );
};
const MovieData = ({ listMovies }) => {
  let match = useRouteMatch();
  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>
          {listMovies.map((movie, index) => {
            return (
              <tr key={index}>
                <td>
                  <Link to={`${match.url}/${movie.id}`}>{movie.id}</Link>
                </td>
                <td>{movie.title}</td>
                <td>{movie.year}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Route path={`${match.path}/:movieId`}>
        <FindMovie />
      </Route>
    </div>
  );
};
const FindMovie = () => {
  let { movieId } = useParams();
  console.log(movieId);
  const [findMovie, setFindMovie] = useState();

  facade.fetchMovieById(movieId).then(res => setFindMovie(res));

  return (
    <div>
      <h2>Details</h2>
      <p>{JSON.stringify(findMovie)}</p>
    </div>
  );
};

const Logout = ({ logout }) => {
  return (
    <div>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
const UserInfo = () => {
  return (
    <div>
      <h2>User Info</h2>
      <li>Username: {facade.getTokenInfo().username}</li>
      <li>Role: {facade.getTokenInfo().roles}</li>
    </div>
  );
};
const NoMatch = () => <div>No match for path</div>;
export default App;
