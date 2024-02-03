import axios, { InternalAxiosRequestConfig } from "axios";

const LOCAL_STORAGE_KEY_ACCESS_TOKEN = "accessToken";
const LOCALS_STORAGE_KEY_USERNAME = "username";

export const anonRequest = axios.create({
  baseURL: import.meta.env.VITE_ROOT_API,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT),
  headers: {
    "Content-Type": "application/json",
  },
});

export const authRequest = axios.create({
  baseURL: import.meta.env.VITE_ROOT_API,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT),
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginUser = async (username: string, password: string) => {
  const response = await anonRequest.post(
    "/api/token",
    { username, password },
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  localStorage.setItem(LOCAL_STORAGE_KEY_ACCESS_TOKEN, response.data.accessToken);
  localStorage.setItem(LOCALS_STORAGE_KEY_USERNAME, username);
};

export const logoutUser = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY_ACCESS_TOKEN);
  localStorage.removeItem(LOCALS_STORAGE_KEY_USERNAME);
};

const authHeaderInterceptor = (requestConfig: InternalAxiosRequestConfig) => {
  if (isUserLoggedIn()) {
    requestConfig.headers.Authorization = `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEY_ACCESS_TOKEN)}`;
  }
  return requestConfig;
};

authRequest.interceptors.request.use(authHeaderInterceptor);

export const getUserInfo = () => {
  const usernameInStorage = localStorage.getItem(LOCALS_STORAGE_KEY_USERNAME);

  return {
    username: usernameInStorage !== null ? usernameInStorage : "",
  };
};

export const setUserInfo = (username: string) => {
  localStorage.setItem(LOCALS_STORAGE_KEY_USERNAME, username);
};

export const isUserLoggedIn = () => {
  return getUserInfo().username !== "";
};
