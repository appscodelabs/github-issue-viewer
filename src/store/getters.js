
const getIssues = state => state.filteredIssues.sort((a, b) => b.updatedAt - a.updatedAt);
const getOrgs = state => state.orgs;
const getCheckboxSelectedIssues = state => state.checkboxSelectedIssues;
const getFilterText = state => state.filterText;
const getFilterOrg = state => state.filterOrg;
const getFilterTime = state => state.filterTime;
const getFilterType = state => state.filterType;
const getGithubToken = state => state.githubToken;

export default {
  getIssues,
  getOrgs,
  getCheckboxSelectedIssues,
  getFilterText,
  getFilterOrg,
  getFilterTime,
  getFilterType,
  getGithubToken,
};
