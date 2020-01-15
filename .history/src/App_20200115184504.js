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
          <NavLink activeClassName="active" to="/search">
            Movie Search
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/addedit">
            Add / Edit
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
        <NavLink activeClassName="active" to="/search">
          Movie Search
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
    <div style={{ paddingLeft: 20 }}>
      <Switch>
        <Route path="/home">
          <Home />
        </Route>
        <Route path="/search">
          <MovieSearch />
        </Route>
        <Route path="/allmovies">
          <AllMovies />
        </Route>
        <Route path="/addedit">
          <AddEdit />
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
    </div>
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
  const emptymovie = {
    title: "",
    id: "",
    year: "",
    actors: [{ id: "", about: "", name: "" }],
    genres: [{ id: "", name: "" }],
    directors: [{ id: "", name: "", about: "" }]
  };
  let { movieId } = useParams();
  const [findMovie, setFindMovie] = useState(emptymovie);

  useEffect(() => {
    facade.fetchMovieById(movieId).then(res => setFindMovie(res));
  }, [movieId]);

  return (
    <div>
      <h2>Details for {findMovie.title}</h2>
      <li>Year of release: {findMovie.year}</li>
      <h3>Director info:</h3>
      {findMovie.directors.map((director, index) => {
        return (
          <div key={index}>
            <li>Name of Director: {director.name}</li>
            <li>About Director: {director.about}</li>
          </div>
        );
      })}
      <h3>Genre: </h3>

      {findMovie.genres.map((genre, index) => {
        return (
          <div key={index}>
            <li>Genres: {genre.name}</li>{" "}
          </div>
        );
      })}

      <h3>Actors: </h3>
      {findMovie.actors.map((actors, index) => {
        return (
          <div key={index}>
            <li>
              {" "}
              {actors.name} - {actors.about}
            </li>
          </div>
        );
      })}
    </div>
  );
};

const MovieSearch = () => {
  const [directors, setDirectors] = useState([{ id: "", name: "", about: "" }]);
  const [actors, setActors] = useState([{ id: "", name: "", about: "" }]);
  const [genres, setGenres] = useState([{ id: "", name: "" }]);

  useEffect(() => {
    facade.fetchAllDirectors().then(res => setDirectors(res));
    facade.fetchAllActors().then(res => setActors(res));
    facade.fetchAllGenres().then(res => setGenres(res));
  }, []);
  /*
  useEffect(() => {
    facade.fetchAllDirectors().then(res => setDirectors(...new Set(res)));
    facade.fetchAllActors().then(res => setActors(...new Set(res)));
    facade.fetchAllGenres().then(res => setGenres(...new Set(res)));
  }, []); 
  */

  return (
    <div>
      You can search on the following Directors:
      {directors.map((director, index) => {
        return <div key={index}>{director.name},</div>;
      })}
      You can search on the following Actors:
      {actors.map((actor, index) => {
        return <div key={index}>{actor.name},</div>;
      })}
      You can search on the following Genres:
      {genres.map((genre, index) => {
        return <div key={index}>{genre.name},</div>;
      })}
      <Search />
    </div>
  );
};

const Search = () => {
  const [search, setSearch] = useState("");
  const emptymovie = {
    title: "",
    id: "",
    year: "",
    actors: [{ id: "", about: "", name: "" }],
    genres: [{ id: "", name: "" }],
    directors: [{ id: "", name: "", about: "" }]
  };

  const [searchedMovie, setSearchedMovie] = useState(emptymovie);

  const handleChange = event => {
    const target = event.target;
    const value = target.value;
    setSearch(value);
  };

  const handleGenreSubmit = event => {
    event.preventDefault();
    facade.fetchMovieByGenre(search).then(res => setSearchedMovie(res));
  };
  const handleTitleSubmit = event => {
    event.preventDefault();
    facade.fetchMovieByTitle(search).then(res => setSearchedMovie(res));
  };

  const handleActorSubmit = event => {
    event.preventDefault();
    facade.fetchMovieByActor(search).then(res => setSearchedMovie(res));
  };

  return (
    <div>
      <input
        type="text"
        id="search"
        placeholder="Search"
        onChange={handleChange}
      />
      <button onClick={handleGenreSubmit}>Genre Search</button>
      <button onClick={handleTitleSubmit}>Title Search</button>
      <button onClick={handleActorSubmit}>Actor Search</button>
      <p>{JSON.stringify(searchedMovie)}</p>
    </div>
  );
};

const AddEdit = () => {
  const emptymovie = {
    title: "",
    id: 0,
    year: 0,
    actors: [{ id: 0, about: "", name: "" }],
    genres: [{ id: 0, name: "" }],
    directors: [{ id: 0, name: "", about: "" }]
  };
  const eMovie = {
    title: "",
    id: 0,
    year: 0
  };
  const eDirector = {
    id: 0,
    name: "",
    about: ""
  };
  const eActor = { id: 0, about: "", name: "" };
  const eGenre = { id: 0, name: "" };
  const [finalMovie, setFinalMovie] = useState(emptymovie);
  const [movie, setMovie] = useState(eMovie);
  const [director, setDirector] = useState(eDirector);
  const [actor, setActor] = useState(eActor);
  const [genre, setGenre] = useState(eGenre);

  const handleChangeMovie = event => {
    const target = event.target;
    const id = target.id;
    const value = target.value;
    setMovie({ ...movie, [id]: value });
  };
  const handleChangeDirector = event => {
    const target = event.target;
    const id = target.id;
    const value = target.value;
    setDirector({ ...director, [id]: value });
  };

  const handleChangeActor = event => {
    const target = event.target;
    const id = target.id;
    const value = target.value;
    setActor({ ...actor, [id]: value });
  };

  const handleChangeGenre = event => {
    const target = event.target;
    const id = target.id;
    const value = target.value;
    setGenre({ ...genre, [id]: value });
  };

  const handleSubmit = event => {
    event.preventDefault();
    const testMovie = {
      title: movie.title,
      id: movie.id,
      year: movie.year,
      actors: [{ id: actor.id, about: actor.about, name: actor.name }],
      genres: [{ id: genre.id, name: genre.name }],
      directors: [
        { id: director.id, name: director.name, about: director.about }
      ]
    };
    facade
      .fetchAddEdit(testMovie)
      .then(res => console.log("Added movie...", res));
  };

  return (
    <div>
      <p>{JSON.stringify(movie)}</p>
      <p>{JSON.stringify(director)}</p>
      <p>{JSON.stringify(actor)}</p>
      <p>{JSON.stringify(genre)}</p>
      <input id="id" placeholder="Movie ID" onChange={handleChangeMovie} />{" "}
      <br />
      <input
        type="text"
        id="title"
        placeholder="Movie Title"
        onChange={handleChangeMovie}
      />{" "}
      <br />
      <input
        id="year"
        placeholder="Release Year"
        onChange={handleChangeMovie}
      />{" "}
      <br />
      <input
        type="text"
        id="about"
        placeholder="About Movie"
        onChange={handleChangeMovie}
      />{" "}
      <br />
      <input
        id="id"
        placeholder="Director ID"
        onChange={handleChangeDirector}
      />{" "}
      <br />
      <input
        type="text"
        id="name"
        placeholder="Director Name"
        onChange={handleChangeDirector}
      />{" "}
      <br />
      <input
        type="text"
        id="about"
        placeholder="About Director"
        onChange={handleChangeDirector}
      />{" "}
      <br />
      <input id="id" placeholder="Actor ID" onChange={handleChangeActor} />{" "}
      <br />
      <input
        type="text"
        id="name"
        placeholder="Actor Name"
        onChange={handleChangeActor}
      />{" "}
      <br />
      <input
        type="text"
        id="about"
        placeholder="About Actor"
        onChange={handleChangeActor}
      />{" "}
      <br />
      <input id="id" placeholder="Genre ID" onChange={handleChangeGenre} />{" "}
      <br />
      <input
        type="text"
        id="name"
        placeholder="Genre Name"
        onChange={handleChangeGenre}
      />{" "}
      <br />
      <button onClick={handleSubmit}>Add Movie</button>
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
