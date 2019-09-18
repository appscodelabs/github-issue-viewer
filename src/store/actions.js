import axios from 'axios';
import moment from 'moment';

const setOrgs = ({ commit, dispatch }, orgs) => {
  localStorage.setItem('orgs', orgs);
  commit('SET_ORGS', orgs);
  dispatch('getRepoIssues');
};
const setGithubToken = ({ commit }, githubToken) => {
  localStorage.setItem('githubToken', githubToken);
  commit('SET_GITHUB_TOKEN', githubToken);
};
const addIssue = ({ commit }, newIssue) => {
  commit('ADD_ISSUE', newIssue);
  commit('UPDATE_FILTER_ISSUES');
};
const addRecent5Issues = ({ commit }, newIssue) => {
  commit('ADD_RECENT_5_ISSUE', newIssue);
};
const addRecent10Issues = ({ commit }, newIssue) => {
  commit('ADD_RECENT_10_ISSUE', newIssue);
};

const getDayDiff = (options) => {
  const timePrev = parseInt(moment(options.createdAt).valueOf() / 1000, 10);
  const timeNow = Math.floor((new Date()).getTime() / 1000); // utc time (s)
  let timeRes = timeNow - timePrev;
  let unit = '';
  if (timeRes < 60) {
    unit = ' second';
  } else if (timeRes < 3600) {
    timeRes = parseInt(timeRes / 60, 10);
    unit = ' minute';
  } else if (timeRes < 86400) {
    timeRes = parseInt(timeRes / 3600, 10);
    unit = ' hour';
  } else {
    timeRes = parseInt(timeRes / 86400, 10);
    unit = ' day';
  }
  if (timeRes > 1) {
    unit = `${unit}s`;
  }
  return `${timeRes}${unit} ago`;
};

const getIssues = async ({ dispatch, state }, { orgName, repoName }) => {
  let issues = [];

  // update state.issues[] items
  const dispatchAddIssue = function dispatchAddIssue(issu, issuLen, whichArray) {
    const issueLen = issuLen || issu.length;
    for (let i = 0; i < issueLen; i += 1) {
      const issue = issu[i];

      const newIssue = Object.assign({
        orgName,
        repoName,
      },
      {
        id: issue.title,
        title: issue.title,
        labels: issue.labels,
        htmlUrl: issue.html_url,
        number: issue.number.toString(),
        createdAt: getDayDiff({ createdAt: issue.created_at }),
        timestamp: moment(issue.created_at).valueOf(),
        updatedAt: moment(issue.updated_at).valueOf(),
        isPR: issue.html_url.search('/pull/') >= 0,
      });

      /* eslint-disable no-param-reassign */
      if (!whichArray && !state.issueUrlUnique[issue.html_url]) {
        state.issueUrlUnique[issue.html_url] = true;
        dispatch('addIssue', newIssue);
      } else if (whichArray === 'recent5Issues' && !state.issueRecent5UrlUnique[issue.html_url]) {
        state.issueRecent5UrlUnique[issue.html_url] = true;
        dispatch('addRecent5Issues', newIssue);
      } else if (whichArray === 'recent10Issues' && !state.issueRecent10UrlUnique[issue.html_url]) {
        state.issueRecent10UrlUnique[issue.html_url] = true;
        dispatch('addRecent10Issues', newIssue);
      }
    }
  };

  const addMostRecent5Issues = function addMostRecent5Issues(issu) {
    let issueLen = issu.length;
    issueLen = issueLen < 5 ? issueLen : 4;
    dispatchAddIssue(issu, issueLen, 'recent5Issues');
  };

  const addMostRecent10Issues = function addMostRecent10Issues(issu) {
    let issueLen = issu.length;
    issueLen = issueLen < 10 ? issueLen : 9;
    dispatchAddIssue(issu, issueLen, 'recent10Issues');
  };

  let issuesLastUpdated = localStorage.getItem(`${orgName}-${repoName}-issues`);
  const needToUpdate = !issuesLastUpdated || (issuesLastUpdated - moment().subtract(10, 'minutes')) < 0;
  if (needToUpdate) {
    const idb = global.indexedDB ||
    global.mozIndexedDB ||
    global.webkitIndexedDB ||
    global.msIndexedDB;

    // const apiUrl = 'https://api.github.com/repos/sajibcse68/delete-it/issues';
    const apiUrl = state.githubToken ?
      `https://api.github.com/repos/${orgName}/${repoName}/issues?access_token=${state.githubToken}` :
      `https://api.github.com/repos/${orgName}/${repoName}/issues`;

    const resp = await axios.get(apiUrl);
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
      addMostRecent5Issues(issues);
      addMostRecent10Issues(issues);

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

      const getStoreIssues = store.get(`${orgName}/${repoName}`);
      getStoreIssues.onsuccess = function getStoreIssuesSuccess() {
        const allIssues = JSON.parse(getStoreIssues.result);
        dispatchAddIssue(allIssues);
        addMostRecent5Issues(allIssues);
        addMostRecent10Issues(allIssues);
      };

      tx.oncomplete = function c() {
        db.close();
      };
    };
  }
};
const getRepos = async ({ commit, state, dispatch }, orgName) => {
  let repoNames = localStorage.getItem(orgName);
  const repoNamesLastUpdated = localStorage.getItem(`${orgName}RepoNamesLastUpdated`);
  const needToUpdate = !repoNamesLastUpdated || (repoNamesLastUpdated - moment().subtract(10, 'minutes').valueOf()) < 0;
  if (needToUpdate) {
    const apiUrl = state.githubToken ?
      `https://api.github.com/orgs/${orgName}/repos?access_token=${state.githubToken}` :
      `https://api.github.com/orgs/${orgName}/repos`;
    const resp = await axios.get(apiUrl);
    repoNames = resp.data.map(repo => repo.name);
    localStorage.setItem(orgName, JSON.stringify(repoNames));
    localStorage.setItem(`${orgName}RepoNamesLastUpdated`, moment().valueOf());
  } else {
    repoNames = JSON.parse(repoNames);
  }
  commit('ADD_REPOS', repoNames);
  const reposLen = repoNames.length;

  for (let i = 0; i < reposLen; i += 1) {
    const repoName = repoNames[i];
    dispatch('getIssues', { orgName, repoName });
  }
};
const updateIssueForCheckboxToggle = ({ commit }, checkboxObj) => {
  commit('UPDATE_ISSUE_FOR_CHECKBOX_TOGGLE', checkboxObj);
};
const resetCheckboxSelectedIssues = ({ commit }) => {
  commit('RESET_CHECKBOX_SELECTED_ISSUES');
};
const updateAllIssuesForCheckboxToggle = ({ state, commit }, checkboxObj) => {
  if (checkboxObj.isSelected) {
    const filteredIssues = [...state.filteredIssues];
    const len = filteredIssues.length;
    for (let i = 0; i < len; i += 1) {
      Object.assign(filteredIssues[i], { isSelected: true });
      commit('UPDATE_ISSUE_FOR_CHECKBOX_TOGGLE', filteredIssues[i]);
    }
  } else {
    commit('RESET_CHECKBOX_SELECTED_ISSUES');
  }
};
const setFilterText = ({ commit }, filterText) => {
  commit('SET_FILTER_TEXT', filterText);
  commit('UPDATE_FILTER_ISSUES');
};
const setFilterOrg = ({ commit }, filterOrg) => {
  commit('SET_FILTER_ORG', filterOrg);
  commit('UPDATE_FILTER_ISSUES');
};
const setFilterTime = ({ commit }, filterTime) => {
  commit('SET_FILTER_TIME', filterTime);
  commit('UPDATE_FILTER_ISSUES');
};
const setFilterType = ({ commit }, filterType) => {
  commit('SET_FILTER_TYPE', filterType);
  commit('UPDATE_FILTER_ISSUES');
};
const getRepoIssues = ({ state, dispatch }) => {
  const orgs = state.orgs && state.orgs.split(',');

  // cleanup previous issues
  state.issues = [];
  state.filteredIssues = [];
  state.issueUrlUnique = {};

  const orgsLen = orgs.length;
  for (let i = 0; i < orgsLen; i += 1) {
    const orgName = orgs[i];
    dispatch('getRepos', orgName);
  }
};

/* eslint-disable */
const cleanupIssuesClickedTimestamp = ({ state }) => {
  const allIssuesHtmlUrl = {};
  const issues = state.issues;
  const len = issues.length;
  for (let i = 0; i < len; i += 1) {
    allIssuesHtmlUrl[issues[i].htmlUrl] = true;
  }

  const idb = global.indexedDB ||
              global.mozIndexedDB ||
              global.webkitIndexedDB ||
              global.msIndexedDB;
  const open = idb.open('issues-clicked-timestamp', 2);
  let db = '';
  open.onupgradeneeded = function a() {
    db = open.result;
    db.createObjectStore('issue', { autoIncrement: true });
  };

  open.onsuccess = function openSuccess() {
    db = open.result;

    const tx = db.transaction('issue', 'readwrite');
    const store = tx.objectStore('issue');
    const allIssuesTimestamps = store.getAllKeys();

    allIssuesTimestamps.onsuccess = function allIssuesTimestampsSuccess() {
      const allTimestamps = allIssuesTimestamps.result;
      const len = allTimestamps.length;
      for (let ii = 0; ii < len; ii += 1) {
        if (!allIssuesHtmlUrl[allTimestamps[ii]]) {
          store.delete(allTimestamps[ii]);
        }
      }
    };
    allIssuesTimestamps.onerror = function getClickedTimestampError(e) {
      console.log('error: ', e);
    };

    tx.oncomplete = function c() {
      db.close();
    };
  };
};

const issuesUpdateTimer = ({ dispatch }) => {
  /* eslint-disable */
  setInterval(function timer() {
    dispatch('getRepoIssues');
  }, 10 * 60 * 1000);

  setInterval(function issuesClickedTimestampTimer() {
    dispatch('cleanupIssuesClickedTimestamp');
  }, (60 * 60 * 1000) + 700);
};

export default {
  setOrgs,
  setGithubToken,
  addIssue,
  addRecent5Issues,
  addRecent10Issues,
  getIssues,
  getRepos,
  updateIssueForCheckboxToggle,
  updateAllIssuesForCheckboxToggle,
  resetCheckboxSelectedIssues,
  setFilterText,
  setFilterOrg,
  setFilterTime,
  setFilterType,
  getRepoIssues,
  issuesUpdateTimer,
};
