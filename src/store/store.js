import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import moment from 'moment';

Vue.use(Vuex);
Vue.use(require('vue-moment'), {
  moment,
});

export default new Vuex.Store({
  state: {
    orgs: localStorage.getItem('orgs'),
    repos: [],
    issues: [],
    filteredIssues: [],
    newIssue: '',
    filterText: '',
    filterOrg: '',
    filterTime: '',
  },
  getters: {
    getIssues: state => state.filteredIssues.sort((a, b) => a.createdAt - b.createdAt),
    getOrgs: state => state.orgs,
    getFilterText: state => state.filterText,
    getFilterOrg: state => state.filterOrg,
    getFilterTime: state => state.filterTime,
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
    SET_FILTER_TIME(state, filterTime) {
      state.filterTime = filterTime;
    },
    UPDATE_FILTER_ISSUES(state) {
      let filteredIssues = [...state.issues];
      if (state.filterOrg) {
        const regexp = new RegExp(state.filterOrg, 'i');
        filteredIssues = filteredIssues.filter(((issue) => {
          const res = issue.orgName.search(regexp) >= 0;
          return res;
        }));
      }
      if (state.filterTime) {
        const filterTime = state.filterTime;
        switch (filterTime) {
          case '7days': {
            const time7DaysAgo = moment().subtract(7, 'd');
            filteredIssues = filteredIssues.filter((issue) => {
              const a = time7DaysAgo - issue.timestamp;
              console.log('a: ', a);
              const b = issue.timestamp - time7DaysAgo.valueOf();
              return b >= 0;
            });
            break;
          }
          case '30days': {
            const time30DaysAgo = moment().subtract(30, 'd');
            filteredIssues = filteredIssues.filter((issue) => {
              const a = issue.timestamp - time30DaysAgo.valueOf();
              return a >= 0;
            });
            break;
          }
          default: {
            break;
          }
        }
      }
      if (state.filterText) {
        const regexp = new RegExp(state.filterText, 'i');

        filteredIssues = filteredIssues.filter(issue =>
          issue.title.search(regexp) >= 0 ||
          issue.number.search(regexp) >= 0);
      }
      state.filteredIssues = filteredIssues.sort((a, b) => a.createdAt - b.createdAt);
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
      let issues = [];

      const dispatchAddIssue = function dispatchAddIssue(issu) {
        const issueLen = issu.length;
        for (let i = 0; i < issueLen; i += 1) {
          const issue = issu[i];

          const newIssue = Object.assign({
            orgName,
            repoName,
          },
          {
            title: issue.title,
            html_url: issue.html_url,
            number: (issue.number.toString()).padStart(5, ' '),
            createdAt: issue.created_at,
            timestamp: moment(issue.created_at).valueOf(),
          });
          dispatch('addIssue', newIssue);
        }
      };

      let issuesLastUpdated = localStorage.getItem(`${orgName}-${repoName}-issues`);
      const needToUpdate = !issuesLastUpdated || (issuesLastUpdated - moment().subtract(1, 'h')) < 0;
      if (needToUpdate) {
        const idb = global.indexedDB ||
        global.mozIndexedDB ||
        global.webkitIndexedDB ||
        global.msIndexedDB;

        const resp = await axios.get(`https://api.github.com/repos/${orgName}/${repoName}/issues`);
        /*
        const resp = {
          data: [
            {
              title: 'abc',
              html_url: 'a/b/c',
              number: 1,
              created_at: moment().valueOf(),
              timestamp: moment().valueOf(),
            },
            {
              title: 'def',
              html_url: 'd/e/f',
              number: 2,
              created_at: moment().subtract(1, 'm').valueOf,
              timestamp: moment().subtract(1, 'm').valueOf,
            },
          ],
        };
        */
        issues = resp.data;
        const open = idb.open('issues-db', 1);
        let db = '';
        open.onupgradeneeded = function a() {
          db = open.result;
          db.createObjectStore('issues', { autoIncrement: true });
        };

        open.onsuccess = function b() {
          db = open.result;
          const tx = db.transaction('issues', 'readwrite');
          const store = tx.objectStore('issues');

          store.put(JSON.stringify(issues), `${orgName}/${repoName}`);
          issuesLastUpdated = localStorage.setItem(`${orgName}-${repoName}-issues`, moment().valueOf());
          dispatchAddIssue(issues);

          tx.oncomplete = function c() {
            db.close();
          };
        };
      } else {
        const idb = global.indexedDB ||
                    global.mozIndexedDB ||
                    global.webkitIndexedDB ||
                    global.msIndexedDB;

        const open = idb.open('issues-db', 1);
        let db = '';

        open.onsuccess = function b() {
          db = open.result;
          const tx = db.transaction('issues', 'readonly');
          const store = tx.objectStore('issues');

          const getAllIssues = store.get(`${orgName}/${repoName}`);
          getAllIssues.onsuccess = function getAllIssuesSuccess() {
            console.log('getAllIssues: ', getAllIssues.result);
            dispatchAddIssue(JSON.parse(getAllIssues.result));
          };

          tx.oncomplete = function c() {
            db.close();
          };
        };
      }
    },
    async getRepos({ commit, dispatch }, orgName) {
      let repoNames = localStorage.getItem(orgName);
      const repoNamesLastUpdated = localStorage.getItem(`${orgName}RepoNamesLastUpdated`);
      const needToUpdate = !repoNamesLastUpdated || (repoNamesLastUpdated - moment().subtract(3, 'h').valueOf()) < 0;
      if (needToUpdate) {
        const resp = await axios.get(`https://api.github.com/orgs/${orgName}/repos`);
        repoNames = resp.data.map(repo => repo.name);
        localStorage.setItem(orgName, JSON.stringify(repoNames));
        localStorage.setItem(`${orgName}RepoNamesLastUpdated`, moment().valueOf());
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
      commit('UPDATE_FILTER_ISSUES');
    },
    setFilterTime({ commit }, filterTime) {
      commit('SET_FILTER_TIME', filterTime);
      commit('UPDATE_FILTER_ISSUES');
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
