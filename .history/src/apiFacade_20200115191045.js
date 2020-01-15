//const URL = "https://leafmight.dk/security";
const URL = "http://localhost:8080/securitystarter";
function handleHttpErrors(res) {
  if (!res.ok) {
    return Promise.reject({ status: res.status, fullError: res.json() });
  }
  return res.json();
}

function apiFacade() {
  const login = (user, password) => {
    const options = makeOptions("POST", true, {
      username: user,
      password: password
    });

    return fetch(URL + "/api/login", options)
      .then(handleHttpErrors)
      .then(res => {
        setToken(res.token);
      });
  };
  const getTokenInfo = () => {
    let jwt = localStorage.getItem("jwtToken");
    let jwtData = jwt.split(".")[1];
    let decodedJwtJsonData = window.atob(jwtData);
    let decodedJWTData = JSON.parse(decodedJwtJsonData);
    return decodedJWTData;
  };
  const setToken = token => {
    localStorage.setItem("jwtToken", token);
  };
  const getToken = () => {
    return localStorage.getItem("jwtToken");
  };
  const loggedIn = () => {
    const loggedIn = getToken() != null;
    return loggedIn;
  };
  const logout = () => {
    localStorage.removeItem("jwtToken");
  };

  const makeOptions = (method, addToken, body) => {
    var opts = {
      method: method,
      headers: {
        "Content-type": "application/json",
        Accept: "application/json"
      }
    };
    if (addToken && loggedIn()) {
      opts.headers["x-access-token"] = getToken();
    }
    if (body) {
      opts.body = JSON.stringify(body);
    }
    return opts;
  };
  const fetchData = () => {
    const options = makeOptions("GET", true); //True add's the token
    if (getTokenInfo().roles === "admin") {
      return fetch(URL + "/api/info/admin", options).then(handleHttpErrors);
    }
    return fetch(URL + "/api/info/user", options).then(handleHttpErrors);
  };

  const fetchAllMovies = () => {
    const options = makeOptions("GET", true); //True add's the token
    return fetch(URL + "/api/movie/allMovies", options).then(handleHttpErrors);
  };

  const fetchMovieById = id => {
    const options = makeOptions("GET", true);
    return fetch(URL + "/api/movie/movieById/" + id, options).then(
      handleHttpErrors
    );
  };

  const fetchAllDirectors = () => {
    const options = makeOptions("GET", true);
    return fetch(URL + "/api/movie/allDirectors", options).then(
      handleHttpErrors
    );
  };

  const fetchAllActors = () => {
    const options = makeOptions("GET", true);
    return fetch(URL + "/api/movie/allActors", options).then(handleHttpErrors);
  };

  const fetchAllGenres = () => {
    const options = makeOptions("GET", true);
    return fetch(URL + "/api/movie/allGenres", options).then(handleHttpErrors);
  };

  const fetchMovieByGenre = genre => {
    const options = makeOptions("GET", true);
    const finalGenre = genre.split(" ").join("%20");
    return fetch(URL + "/api/movie/movieByGenre/" + finalGenre, options).then(
      handleHttpErrors
    );
  };
  const fetchMovieByTitle = title => {
    const options = makeOptions("GET", true);
    const finalTitle = title.split(" ").join("%20");
    return fetch(
      URL + "/api/movie/movieByPartTitle/" + finalTitle,
      options
    ).then(handleHttpErrors);
  };

  const fetchMovieByActor = actorName => {
    const options = makeOptions("Get", true);
    const finalActorName = actorName.split(" ").join("%20");
    return fetch(
      URL + "/api/movie/movieByActor/" + finalActorName,
      options
    ).then(handleHttpErrors);
  };

  const fetchAddEdit = movieDTO => {
    if (movieDTO.id === 0) {
      const options = makeOptions("POST", true, movieDTO);
      console.log("FACADE---adding,", movieDTO);
      return fetch(URL + "/api/movie/addMovie/", options).then(
        handleHttpErrors
      );
    }
    const options = makeOptions("PUT", true, movieDTO);
    console.log("FACADE---EDITTING,", movieDTO);
    return fetch(URL + "/api/movie/editMovie/" + movieDTO.id, options).then(
      handleHttpErrors
    );
  };

  return {
    makeOptions,
    setToken,
    getToken,
    loggedIn,
    login,
    logout,
    getTokenInfo,
    fetchData,
    fetchAllMovies,
    fetchMovieById,
    fetchAllDirectors,
    fetchAllActors,
    fetchAllGenres,
    fetchMovieByGenre,
    fetchMovieByTitle,
    fetchMovieByActor,
    fetchAddEdit
  };
}
const facade = apiFacade();
export default facade;
