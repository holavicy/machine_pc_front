const state = {
  user_id: "",
  job_number: "",
  name: "",
  roles: [],
  isSuperAdmin: false,
};

const mutations = {
  setUserId(state, userId) {
    state.user_id = userId;
  },
  setJobNumber(state, jobNumber) {
    state.job_number = jobNumber;
  },
  setName(state, name) {
    state.name = name;
  },
  setRoles(state, roles) {
    state.roles = roles;
  },
  setIsSuperAdmin(state, isSuperAdmin) {
    state.isSuperAdmin = isSuperAdmin;
  },
};

const actions = {
  setUserIds() {},
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
