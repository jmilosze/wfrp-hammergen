import axios, { InternalAxiosRequestConfig } from "axios";

const LOCAL_STORAGE_KEY_ACCESS_TOKEN = "accessToken";
const LOCALS_STORAGE_KEY_USERNAME = "username";
const LOCAL_STORAGE_KEY_USER_ID = "userId";

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
  const accessToken = response.data.accessToken;
  localStorage.setItem(LOCAL_STORAGE_KEY_ACCESS_TOKEN, accessToken);
  localStorage.setItem(LOCALS_STORAGE_KEY_USERNAME, username);

  // Extract and save the sub field from the JWT token
  try {
    const payload = JSON.parse(atob(accessToken.split(".")[1]));
    localStorage.setItem(LOCAL_STORAGE_KEY_USER_ID, payload.sub);
  } catch (error) {
    console.error("Failed to extract user ID from token:", error);
  }
};

export const logoutUser = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY_ACCESS_TOKEN);
  localStorage.removeItem(LOCALS_STORAGE_KEY_USERNAME);
  localStorage.removeItem(LOCAL_STORAGE_KEY_USER_ID);
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
  const userIdInStorage = localStorage.getItem(LOCAL_STORAGE_KEY_USER_ID);

  return {
    username: usernameInStorage !== null ? usernameInStorage : "",
    userId: userIdInStorage !== null ? userIdInStorage : "",
  };
};

export const setUserInfo = (username: string) => {
  localStorage.setItem(LOCALS_STORAGE_KEY_USERNAME, username);
};

export const isUserLoggedIn = () => {
  return getUserInfo().username !== "";
};
