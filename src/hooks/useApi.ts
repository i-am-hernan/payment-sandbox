import { useEffect, useState } from "react";

type UseApi = (
  endpoint: string,
  method: string,
  payload?: any,
  options?: {
    cache?: string;
  }
) => { data: any; loading: boolean; error: any };

export type RequestOptions = {
  method: string;
  headers: {
    "Content-type": string;
    Authorization?: string;
  };
  cache?: string;
  body?: string;
};

export const useApi: UseApi = (endpoint, method, payload, options) => {
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

    if (options?.cache) {
      requestOptions.cache = options.cache;
    }

    if (payload) {
      requestOptions.body = JSON.stringify(payload);
    }

    const makeRequest: () => void = async () => {
      try {
        setLoading(true);
        setData(null);
        const domain =
          process.env.VERCEL_URL || process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${domain}/${endpoint}`, {
          method: requestOptions.method,
          headers: requestOptions.headers,
          body: requestOptions.body,
          cache: requestOptions.cache as RequestCache
        });
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
