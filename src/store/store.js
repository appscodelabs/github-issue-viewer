import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

Vue.use(Vuex);
Vue.use(require('vue-moment'), {
  moment,
});

export default new Vuex.Store({
  state: {
    orgs: localStorage.getItem('orgs'),
    githubToken: localStorage.getItem('githubToken'),
    repos: [],
    issues: [],
    checkboxSelectedIssues: [],
    checkboxSelectedIssueToIndexMap: {},
    issueUrlUnique: {},
    issueRecent5UrlUnique: {},
    issueRecent10UrlUnique: {},
    filteredIssues: [],
    recent5Issues: [],
    recent10Issues: [],
    newIssue: '',
    filterText: '',
    filterOrg: '',
    filterTime: '',
    filterType: '',
  },

  getters,

  mutations,

  actions,
});
