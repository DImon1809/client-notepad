import Navbar from "./components/Navbar.jsx";

import { router } from "./router";
import { useHttp } from "./hooks/useHttp";
import { Context } from "./Contex.js";
import { useAuth } from "./hooks/useAuth";

import "./App.scss";

const App = () => {
  const { request, ready, error, clearErrors } = useHttp();
  const { logIn, logOut, token } = useAuth();
  const isAuthorized = !!token;

  return (
    <>
      <Context.Provider
        value={{ request, ready, error, clearErrors, logIn, logOut, token }}
      >
        {isAuthorized && <Navbar />}
        {router(isAuthorized)}
      </Context.Provider>
    </>
  );
};

export default App;
