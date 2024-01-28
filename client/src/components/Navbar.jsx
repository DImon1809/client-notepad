import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Navbar.scss";

import { Context } from "../Contex";

const Navbar = () => {
  const { logOut } = useContext(Context);
  const navigate = useNavigate();
  const [active, setActive] = useState(false);

  const leaveHandler = () => {
    navigate("/");
    logOut();
  };

  return (
    <nav className="navbar">
      <div className="navigations-container">
        <div className="logo-container">
          <h1>Мой проект</h1>
        </div>
        <div className="menu-burger" onClick={() => setActive(!active)}>
          <img
            className={`burger ${active ? "active" : ""}`}
            src="../images/burger.png"
            alt="#"
          />
          <img
            className={`burger-active ${active ? "active" : ""}`}
            src="../images/burger_active.png"
            alt="#"
          />
        </div>
        <div className={`nav-items ${active ? "active" : ""}`}>
          <ul className="list-container">
            <li className="list-item">
              <Link to="/">Списки</Link>
            </li>
            <li className="list-item">
              <Link to="/create">Создать</Link>
            </li>
            <li className="list-item" onClick={leaveHandler}>
              Выход
            </li>
          </ul>
        </div>
      </div>
      <div
        className={`wrapper-container ${active ? "active" : ""}`}
        onClick={() => setActive(false)}
      ></div>
    </nav>
  );
};

export default Navbar;
