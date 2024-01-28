import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Loading from "../components/Loading";

import "./AuthForm.scss";

import { Context } from "../Contex";

let counterId = null;

const AuthForm = () => {
  const { request, error, clearErrors, logIn, ready } = useContext(Context);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [reqister, setRegister] = useState(true);
  const [noValid, setNoValid] = useState(false);
  const [runTimer, setRunTimer] = useState(false);
  const [count, setCount] = useState(60);
  const emailItem = "myEmail";

  const forHandlerRequest = (event) => {
    event.preventDefault();

    setEmail("");
    setPassword("");
    setCode("");
  };

  const variablesOfTimer = (boolRun) => {
    setRunTimer(boolRun);
    setCount(60);
  };

  const signUpHandler = async (event) => {
    try {
      forHandlerRequest(event);

      const response = await request("post", "/auth/register", {
        email: email.trim(),
        password: password.trim(),
      });

      if (response) {
        localStorage.setItem(emailItem, email.trim());

        variablesOfTimer(true);

        setRegister(false);
      }
    } catch (err) {
      return console.error(err);
    }
  };

  const logInHandler = async (event) => {
    try {
      forHandlerRequest(event);

      const response = await request("post", "/auth/login", {
        email,
        password,
      });

      if (response?.data?.token && response?.data?.exp) logIn(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const gotoBackHandler = () => {
    navigate("/");

    setRegister(true);

    localStorage.removeItem(emailItem);

    variablesOfTimer(false);
  };

  const inputCode = async (event) => {
    try {
      forHandlerRequest(event);

      const response = await request("post", "/auth/confirm", {
        email: localStorage.getItem(emailItem),
        code,
      });

      if (response) {
        alert(response?.data?.message || "Воу!");

        gotoBackHandler();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sendRepeatCodeHandler = async (event) => {
    try {
      forHandlerRequest(event);

      const response = await request("post", "/auth/repeat", {
        email: localStorage.getItem(emailItem),
      });

      variablesOfTimer(true);

      return response && alert(response?.data?.message || "Воу!");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (error) {
      error?.response?.data?.message
        ? alert(error?.response?.data?.message)
        : alert("Что-то пошло не так!");

      setNoValid(true);
    }

    clearErrors();
  }, [clearErrors, error]);

  useEffect(() => {
    localStorage.removeItem(emailItem);

    setNoValid(false);
  }, [email, password]);

  useEffect(() => {
    counterId = setInterval(() => {
      runTimer && setCount(() => (count >= 1 ? count - 1 : 0));
    }, 1000);

    return () => clearInterval(counterId);
  }, [runTimer, count, setRunTimer]);

  return ready ? (
    <section className="form-register">
      <img
        src="https://mykaleidoscope.ru/x/uploads/posts/2022-10/1666206241_12-mykaleidoscope-ru-p-kartinka-na-zastavku-oboi-12.jpg"
        alt="#"
        className="background-image"
      />
      <div className="form-container">
        {reqister ? (
          <>
            <h1>Аутентификация</h1>

            <form className="form-funtional">
              <div className="email">
                <input
                  type="text"
                  name="email"
                  id="email"
                  autoComplete="off"
                  placeholder=" "
                  className={noValid ? "no-valid" : ""}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <label htmlFor="email">Введите е-маил</label>
              </div>
              <div className="password">
                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="off"
                  placeholder=" "
                  className={noValid ? "no-valid" : ""}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <label htmlFor="password">Введите пароль</label>
              </div>

              <div className="form-buttons">
                <button className="log-in" onClick={logInHandler}>
                  Войти
                </button>
                <button className="sign-up" onClick={signUpHandler}>
                  Зарегистрироваться
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2>На ваш е-маил был отправлен код доступа</h2>

            <form className="form-funtional">
              <div className="code-input">
                <input
                  type="text"
                  name="code"
                  id="code"
                  autoComplete="off"
                  placeholder=" "
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                />
                <label htmlFor="email">Код подтверждения</label>
              </div>

              <div className="examination-buttons">
                <button className="goto-back" onClick={gotoBackHandler}>
                  Назад
                </button>
                <button className="input-code" onClick={inputCode}>
                  Ввести
                </button>
                {count <= 0 ? (
                  <button className="send-code" onClick={sendRepeatCodeHandler}>
                    Отправить повторно
                  </button>
                ) : (
                  <button
                    className="send-code-block"
                    onClick={(event) => event.preventDefault()}
                  >
                    Отправить повторно через
                    {" " + count}
                  </button>
                )}
              </div>
            </form>
          </>
        )}
      </div>
    </section>
  ) : (
    <Loading />
  );
};

export default AuthForm;
