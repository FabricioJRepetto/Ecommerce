import axios from "axios";
import { useEffect, useState } from "react";
import { BACK_URL } from "../constants";

export const useAxios = (method, endpoint, payload) => {
  const [data, setData] = useState(null),
    [error, setError] = useState(null),
    [loading, setLoading] = useState(true),
    token = localStorage.getItem("loggedTokenEcommerce"),
    headers = { Authorization: `Bearer ${token}` },
    url = BACK_URL + endpoint;

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.request({
          method,
          url,
          data: payload,
          headers,
        });
        setData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line
  }, []);

  return { data, loading, error };
};
