import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    orgs: localStorage.getItem('orgs'),
    repos: [],
    issues: [],
    filteredIssues: [],
    newIssue: '',
    filterText: '',
    filterOrg: '',
  },
  getters: {
    getIssues: state => state.filteredIssues.sort((a, b) => a.createdAt - b.createdAt),
    getOrgs: state => state.orgs,
    getFilterText: state => state.filterText,
    getFilterOrg: state => state.filterOrg,
  },
  mutations: {
    /* eslint-disable no-param-reassign */
    SET_ORGS(state, orgs) {
      state.orgs = orgs;
    },
    /* eslint-disable no-param-reassign */
    ADD_REPOS(state, repos) {
      state.repos = [...state.repos, ...repos];
    },
    ADD_ISSUE(state, newIssue) {
      state.issues.push(newIssue);
      state.filteredIssues.push(newIssue);
    },
    SET_FILTER_TEXT(state, filterText) {
      state.filterText = filterText;
    },
    SET_FILTER_ORG(state, filterOrg) {
      state.filterOrg = filterOrg;
    },
    UPDATE_FILTER_ISSUES(state) {
      if (state.filterText) {
        const regexp = new RegExp(state.filterText, 'i');

        const filteredIssues = state.issues.filter((issue) => {
          console.log('issue.orgName: ', issue.orgName);
          return issue.title.search(regexp) >= 0 ||
          issue.number.search(regexp) >= 0;
        });
        state.filteredIssues = filteredIssues.sort((a, b) => a.createdAt - b.createdAt);
      } else {
        state.filterIssues = state.issues;
      }
    },
  },
  actions: {
    setOrgs({ commit }, orgs) {
      localStorage.setItem('orgs', orgs);
      commit('SET_ORGS', orgs);
      const localOrgs = localStorage.getItem('orgs');
      console.log('localOrgs: ', localOrgs);
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
          html_url: issue.html_url,
          number: (issue.number.toString()).padStart(5, ' '),
          createdAt: issue.created_at,
        });
        dispatch('addIssue', newIssue);
      }
    },
    async getRepos({ commit, dispatch }, orgName) {
      let repoNames = localStorage.getItem(orgName);
      if (!repoNames) {
        const resp = await axios.get(`https://api.github.com/orgs/${orgName}/repos`);
        repoNames = resp.data.map(repo => repo.name);
        localStorage.setItem(orgName, repoNames);
      } else {
        repoNames = repoNames.split(',');
      }
      commit('ADD_REPOS', repoNames);
      const reposLen = repoNames.length;

      for (let i = 0; i < reposLen; i += 1) {
        const repoName = repoNames[i];
        dispatch('getIssues', { orgName, repoName });
      }
    },
    setFilterText({ commit }, filterText) {
      commit('SET_FILTER_TEXT', filterText);
      commit('UPDATE_FILTER_ISSUES');
    },
    setFilterOrg({ commit }, filterOrg) {
      commit('SET_FILTER_ORG', filterOrg);
    },
    getRepoIssues({ state, dispatch }) {
      const orgs = state.orgs && state.orgs.split(',');
      console.log('state.orgs: ', orgs);
      const orgsLen = orgs.length;
      for (let i = 0; i < orgsLen; i += 1) {
        const orgName = orgs[i];
        dispatch('getRepos', orgName);
      }
    },
  },
});
