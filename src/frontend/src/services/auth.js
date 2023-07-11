import axios from "axios";

const ACCESS_TOKEN = "accessToken";
const USERNAME = "username";
const TOKEN_PATH = "/api/token";

export const anonRequest = axios.create({
  baseURL: import.meta.env.VITE_ROOT_API,
  timeout: import.meta.env.VITE_API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authRequest = axios.create({
  baseURL: import.meta.env.VITE_ROOT_API,
  timeout: import.meta.env.VITE_API_TIMEOUT,
  skipIntercept: false,
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginUser = async (username, password) => {
  const response = await anonRequest.post(
    TOKEN_PATH,
    { username, password },
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  localStorage.setItem(ACCESS_TOKEN, response.data.accessToken);
  localStorage.setItem(USERNAME, username);
};

export const logoutUser = () => {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(USERNAME);
};

const authHeaderInterceptor = (requestConfig) => {
  if (isUserLoggedIn()) {
    requestConfig.headers.Authorization = `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`;
  }
  return requestConfig;
};

authRequest.interceptors.request.use(authHeaderInterceptor);

export const userInfo = () => {
  return {
    username: localStorage.getItem(USERNAME),
  };
};

export const isUserLoggedIn = () => {
  return userInfo().username != null;
};
