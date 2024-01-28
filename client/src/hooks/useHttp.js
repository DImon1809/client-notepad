import { useState, useCallback } from "react";

import axios from "axios";

export const useHttp = () => {
  const [ready, setReady] = useState(true);
  const [error, setError] = useState(false);

  const request = useCallback(
    async (
      method = "get",
      url,
      data = {},
      headers = {
        "Content-Type": "application/json",
      }
    ) => {
      try {
        setReady(false);
        const response = await axios({
          method,
          url: `http://45.9.40.156:4000${url}`,
          data,
          headers,
        });

        setReady(true);
        setError(false);

        return response;
      } catch (err) {
        setReady(true);
        setError(err);
      }
    },
    []
  );

  const clearErrors = () => {
    setError(false);
  };

  return { request, ready, error, clearErrors };
};
