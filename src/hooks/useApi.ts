import { useEffect, useState } from 'react';
import { API_URL } from '../config';

type UseApi = (endpoint: string, method: string, payload?: any) => { data: any; loading: boolean; error: any };

export type RequestOptions = {
    method: string;
    headers: {
      'Content-type': string;
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
        'Content-type': 'application/json'
      }
    };

    if (payload) {
      requestOptions.body = JSON.stringify(payload);
    }

    const makeRequest: () => void = async () => {
      try {
        const response = await fetch(`${API_URL}/${endpoint}`, requestOptions);
        const data = await response.json();
        setLoading(false);
        setData(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      }
    };

    makeRequest();

    return () => {};
  }, [endpoint, method, payload]);

  return { data, loading, error };
};