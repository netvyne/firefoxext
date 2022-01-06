// @ts-nocheck
import axios from 'axios';
import { QueryClient } from 'react-query';

export class CustomError extends Error {
  // eslint-disable-next-line no-unused-vars
  constructor(public res: Response, message?: string) {
    super(message);
  }
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    crossdomain?: boolean;
  }
}

const defaultQueryFn = async ({ queryKey }) => {
  chrome.cookies.set({
    "name": "testnetvyne",
    "url": "http://localhost:5002",
    "value": "testvalue"
}, function (cookie) {
    console.log(JSON.stringify(cookie));
    console.log(chrome.extension.lastError);
    console.log(chrome.runtime.lastError);
});
  const { data } = await axios.get(
    `${process.env.REACT_APP_PUBLIC_API}${queryKey[0]}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      crossdomain: true,
    },
  );
  return data;
};

const defaultMutationFn = async (args: { route: any; data: any; }) => {
  const { data } = await axios.post(
    `${process.env.REACT_APP_PUBLIC_API}${args.route}`,
    args.data,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      crossdomain: true,
    },
  );
  // console.log('mutation response', data);
  return data;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
    mutations: {
      mutationFn: defaultMutationFn,
    },
  },
});
