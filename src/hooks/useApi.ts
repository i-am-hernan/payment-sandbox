import { useEffect, useState } from "react";

type UseApi = (
  endpoint: string,
  method: string,
  payload?: any
) => { data: any; loading: boolean; error: any };

export type RequestOptions = {
  method: string;
  headers: {
    "Content-type": string;
    Authorization?: string;
  };
  body?: string;
};

export const useApi: UseApi = (endpoint, method, payload) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const requestOptions: RequestOptions = {
      method,
      headers: {
        "Content-type": "application/json",
      },
    };

    if (payload) {
      requestOptions.body = JSON.stringify(payload);
    }

    const makeRequest: () => void = async () => {
      try {
        setLoading(true);
        const domain =
          process.env.VERCEL_URL || process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${domain}/${endpoint}`, requestOptions);
        const data = await response.json();
        setLoading(false);
        if (data.status >= 400) {
          setError(data);
        } else {
          setData(data);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      }
    };

    makeRequest();

    return () => {};
  }, [endpoint, method]);

  return { data, loading, error };
};
