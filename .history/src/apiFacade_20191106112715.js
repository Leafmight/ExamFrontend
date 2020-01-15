const URL = "ADD URL TO YOU SERVER";
function handleHttpErrors(res) {
  if (!res.ok) {
    return Promise.reject({ status: res.status, fullError: res.json() });
  }
  return res.json();
}

class ApiFacade {
    const facade = new ApiFacade();
const setToken = token => {
  localStorage.setItem("jwtToken", token);
};
const getToken = () => {
  return localStorage.getItem("jwtToken");
};
const loggedIn = () => {
  const loggedIn = this.getToken() != null;
  return loggedIn;
};
const logout = () => {
  localStorage.removeItem("jwtToken");
};
const login = (user, pass) => {
  const options = this.makeOptions("POST", true, {
    username: user,
    password: pass
  });
  return fetch(URL + "/api/login", options)
    .then(handleHttpErrors)
    .then(res => {
      this.setToken(res.token);
    });
};
  //Insert utility-methods from a latter step (d) here
  makeOptions(method, addToken, body) {
    var opts = {
      method: method,
      headers: {
        "Content-type": "application/json",
        Accept: "application/json"
      }
    };
    if (addToken && this.loggedIn()) {
      opts.headers["x-access-token"] = this.getToken();
    }
    if (body) {
      opts.body = JSON.stringify(body);
    }
    return opts;
  }
}


export default facade;
