import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    orgs: ['appscode', 'kubepack'],
    repos: [],
    issues: [],
    newIssue: '',
  },
  getters: {
    getIssues: state => state.issues,
  },
  mutations: {
    ADD_ORG(state) {
      state.orgs.push('kubedb');
    },
    /* eslint-disable no-param-reassign */
    ADD_REPOS(state, repos) {
      state.repos = [...state.repos, ...repos];
    },
    ADD_ISSUE(state, newIssue) {
      state.issues.push(newIssue);
    },
  },
  actions: {
    addOrg({ commit }, orgName) {
      commit('ADD_ORG', orgName);
    },
    addIssue({ commit }, newIssue) {
      commit('ADD_ISSUE', newIssue);
    },
    async getIssues({ dispatch }, { orgName, repoName }) {
      const resp = await axios.get(`https://api.github.com/repos/${orgName}/${repoName}/issues`);
      const issues = resp.data;
      const issueLen = issues.length;
      for (let i = 0; i < issueLen; i += 1) {
        const issue = issues[i];
        const newIssue = Object.assign({
          orgName,
          repoName,
        },
        {
          title: issue.title,
          createdAt: issue.created_at,
        });
        dispatch('addIssue', newIssue);
      }
    },
    async getRepos({ commit, dispatch }, orgName) {
      const resp = await axios.get(`https://api.github.com/orgs/${orgName}/repos`);
      const repos = resp.data;
      commit('ADD_REPOS', repos);
      const reposLen = repos.length;

      for (let i = 0; i < reposLen; i += 1) {
        const repo = repos[i];
        dispatch('getIssues', { orgName, repoName: repo.name });
      }
    },
    getRepoIssues({ state, dispatch }) {
      const orgs = state.orgs;
      const orgsLen = orgs.length;
      for (let i = 0; i < orgsLen; i += 1) {
        const orgName = orgs[i];
        dispatch('getRepos', orgName);
      }
    },
  },
});
