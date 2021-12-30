import { loginUser, logoutUser, isUserLoggedIn } from "../services/auth";

export const auth = {
  namespaced: true,
  state: () => ({
    isLoggedIn: isUserLoggedIn(),
  }),
  mutations: {
    setLoggedInTrue(state) {
      state.isLoggedIn = true;
    },
    setLoggedInFalse(state) {
      state.isLoggedIn = false;
    },
  },
  actions: {
    async login({ commit }, { username, password }) {
      await loginUser(username, password);
      commit("setLoggedInTrue");
    },
    logout({ commit }) {
      logoutUser();
      commit("setLoggedInFalse");
    },
  },
};
