import axios from "axios";

const ACCESS_TOKEN = "access_token";
const REFRESH_TOKEN = "refresh_token";
const USERNAME = "username";

const anonRequest = axios.create({
  baseURL: process.env.VUE_APP_ROOT_API,
  timeout: process.env.VUE_APP_API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

const authRequest = axios.create({
  baseURL: process.env.VUE_APP_ROOT_API,
  timeout: process.env.VUE_APP_API_TIMEOUT,
  skipIntercept: false,
  headers: {
    "Content-Type": "application/json",
  },
});

const loginUser = async (username, password) => {
  const response = await anonRequest.post("/api/user/auth", { username, password });
  localStorage.setItem(ACCESS_TOKEN, response.data.data.access_token);
  localStorage.setItem(REFRESH_TOKEN, response.data.data.refresh_token);
  localStorage.setItem(USERNAME, username);
};

const refreshToken = async () => {
  const headers = { Authorization: `Bearer ${localStorage.getItem(REFRESH_TOKEN)}` };
  const response = await anonRequest.get("/api/user/refresh", { headers });
  localStorage.setItem(ACCESS_TOKEN, response.data.data.access_token);
};

const logoutUser = () => {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
  localStorage.removeItem(USERNAME);
};

const errorInterceptor = async (error) => {
  const originalConfig = error.config;
  const status = error.response?.status;
  if (isUserLoggedIn() && status === 401 && !originalConfig.skipIntercept) {
    try {
      await refreshToken();
      originalConfig.skipIntercept = true;
      return authRequest(originalConfig);
    } catch (refreshTokenError) {
      throw refreshTokenError;
    }
  }
  throw error;
};

const authHeaderInterceptor = (requestConfig) => {
  if (isUserLoggedIn()) {
    requestConfig.headers.Authorization = `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`;
  }
  return requestConfig;
};

authRequest.interceptors.request.use(authHeaderInterceptor);

authRequest.interceptors.response.use(
  (response) => response,
  (error) => errorInterceptor(error)
);

const userInfo = () => {
  return {
    username: localStorage.getItem(USERNAME),
  };
};

const isUserLoggedIn = () => {
  return userInfo().username != null;
};

export { loginUser, logoutUser, userInfo, isUserLoggedIn, authRequest, anonRequest };
