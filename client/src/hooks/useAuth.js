import { useEffect, useState, useCallback } from "react";
import { useHttp } from "./useHttp";

const nameKey = "userData";

let timerId = null;

export const useAuth = () => {
  const { request } = useHttp();
  const [token, setToken] = useState(null);

  const timerUntilExpireToken = useCallback(
    (exp) => {
      let timeUntilExp = exp - 60000;

      timerId = setTimeout(async () => {
        try {
          const { currentToken } = JSON.parse(localStorage.getItem(nameKey));

          const response = await request(
            "get",
            "/auth/refresh",
            {},
            {
              "Content-Type": "application/json",
              authorization: currentToken,
            }
          );

          if (response?.data?.token && response?.data?.exp) {
            localStorage.setItem(
              nameKey,
              JSON.stringify({
                currentToken: response.data.token,
                exp: response.data.exp,
              })
            );

            timerUntilExpireToken(response.data.exp);
          }
        } catch (err) {
          console.error(err);
        }
      }, timeUntilExp);
    },
    [request]
  );

  const abortTimer = () => timerId && clearTimeout(timerId);

  const logIn = useCallback(
    (data) => {
      setToken(data.token || data.currentToken);

      localStorage.setItem(
        nameKey,
        JSON.stringify({
          currentToken: data.token || data.currentToken,
          exp: data.exp,
        })
      );

      timerUntilExpireToken(data.exp);
    },
    [timerUntilExpireToken]
  );

  const logOut = useCallback(() => {
    setToken(null);

    localStorage.removeItem(nameKey);

    abortTimer();
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(nameKey));

    if (data?.currentToken && data?.exp) {
      logIn(data);
    }
  }, [logIn]);

  return { logIn, logOut, token };
};
