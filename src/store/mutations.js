import moment from 'moment';

/* eslint-disable no-param-reassign */
const SET_ORGS = (state, orgs) => {
  state.orgs = orgs;
};
const SET_GITHUB_TOKEN = (state, githubToken) => {
  state.githubToken = githubToken;
};
const ADD_REPOS = (state, repos) => {
  state.repos = [...state.repos, ...repos];
};
const ADD_ISSUE = (state, newIssue) => {
  state.issues.push(newIssue);
  state.filteredIssues.push(newIssue);
};
const ADD_RECENT_5_ISSUE = (state, newIssue) => {
  state.recent5Issues.push(newIssue);
};
const ADD_RECENT_10_ISSUE = (state, newIssue) => {
  state.recent10Issues.push(newIssue);
};
const SET_FILTER_TEXT = (state, filterText) => {
  state.filterText = filterText;
};
const SET_FILTER_ORG = (state, filterOrg) => {
  state.filterOrg = filterOrg;
};
const SET_FILTER_TIME = (state, filterTime) => {
  state.filterTime = filterTime;
};
const UPDATE_FILTER_ISSUES = (state) => {
  let filteredIssues = ''; // [...state.issues]
  if (state.filterTime) {
    const filterTime = state.filterTime;
    if (filterTime === 'recent5') {
      filteredIssues = state.recent5Issues;
    } else if (filterTime === 'recent10') {
      filteredIssues = state.recent10Issues;
    } else {
      filteredIssues = [...state.issues];
    }
    switch (filterTime) {
      case '7days': {
        const time7DaysAgo = moment().subtract(7, 'd');
        filteredIssues = filteredIssues.filter((issue) => {
          const b = issue.timestamp - time7DaysAgo.valueOf();
          return b >= 0;
        });
        break;
      }
      case '15days': {
        const time15DaysAgo = moment().subtract(15, 'd');
        filteredIssues = filteredIssues.filter(issue =>
          issue.timestamp >= time15DaysAgo.valueOf());
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
  } else {
    filteredIssues = [...state.issues];
  }
  if (state.filterOrg) {
    const regexp = new RegExp(state.filterOrg, 'i');
    filteredIssues = filteredIssues.filter(((issue) => {
      const res = issue.orgName.search(regexp) >= 0;
      return res;
    }));
  }
  if (state.filterText) {
    const regexp = new RegExp(state.filterText, 'i');
    filteredIssues = filteredIssues.filter(issue =>
      issue.title.search(regexp) >= 0 ||
      issue.number.search(regexp) >= 0 ||
      issue.repoName.search(regexp) >= 0);
  }
  state.filteredIssues = filteredIssues;
};

export default {
  SET_ORGS,
  SET_GITHUB_TOKEN,
  ADD_REPOS,
  ADD_ISSUE,
  ADD_RECENT_5_ISSUE,
  ADD_RECENT_10_ISSUE,
  SET_FILTER_TEXT,
  SET_FILTER_ORG,
  SET_FILTER_TIME,
  UPDATE_FILTER_ISSUES,
};
