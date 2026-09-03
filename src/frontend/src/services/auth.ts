import axios, { InternalAxiosRequestConfig } from "axios";

const LOCAL_STORAGE_KEY_ACCESS_TOKEN = "accessToken";
const LOCALS_STORAGE_KEY_USERNAME = "username";
const LOCAL_STORAGE_KEY_USER_ID = "userId";
const LOCAL_STORAGE_KEY_ADMIN = "admin";

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

  // Extract and save the sub and adm fields from the JWT token
  try {
    const payload = JSON.parse(atob(accessToken.split(".")[1]));
    localStorage.setItem(LOCAL_STORAGE_KEY_USER_ID, payload.sub);
    localStorage.setItem(LOCAL_STORAGE_KEY_ADMIN, payload.adm ? "true" : "false");
  } catch (error) {
    console.error("Failed to extract user ID or admin status from token:", error);
  }
};

export const logoutUser = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY_ACCESS_TOKEN);
  localStorage.removeItem(LOCALS_STORAGE_KEY_USERNAME);
  localStorage.removeItem(LOCAL_STORAGE_KEY_USER_ID);
  localStorage.removeItem(LOCAL_STORAGE_KEY_ADMIN);
};

const authHeaderInterceptor = (requestConfig: InternalAxiosRequestConfig) => {
  if (isUserLoggedIn()) {
    requestConfig.headers.Authorization = `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEY_ACCESS_TOKEN)}`;
  }
  return requestConfig;
};

authRequest.interceptors.request.use(authHeaderInterceptor);

export const isUserAdmin = (): boolean => {
  if (typeof localStorage === "undefined") {
    return false;
  }
  const adminInStorage = localStorage.getItem(LOCAL_STORAGE_KEY_ADMIN);
  if (adminInStorage !== null) {
    return adminInStorage === "true";
  }
  const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY_ACCESS_TOKEN);
  if (!accessToken) {
    return false;
  }
  try {
    const payload = JSON.parse(atob(accessToken.split(".")[1]));
    return !!payload.adm;
  } catch {
    return false;
  }
};

export const getUserInfo = () => {
  if (typeof localStorage === "undefined") {
    return {
      username: "",
      userId: "",
      admin: false,
    };
  }
  const usernameInStorage = localStorage.getItem(LOCALS_STORAGE_KEY_USERNAME);
  const userIdInStorage = localStorage.getItem(LOCAL_STORAGE_KEY_USER_ID);

  return {
    username: usernameInStorage !== null ? usernameInStorage : "",
    userId: userIdInStorage !== null ? userIdInStorage : "",
    admin: isUserAdmin(),
  };
};

export const setUserInfo = (username: string) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(LOCALS_STORAGE_KEY_USERNAME, username);
  }
};

export const isUserLoggedIn = () => {
  return getUserInfo().username !== "";
};
