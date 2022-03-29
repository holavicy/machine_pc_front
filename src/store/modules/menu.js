const state = {
  menuData: [],
};

const mutations = {
  setMenu(state, menuData) {
    state.menuData = menuData;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
