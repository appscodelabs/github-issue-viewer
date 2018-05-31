
const getIssues = state => state.filteredIssues.sort((a, b) => b.updatedAt - a.updatedAt);
const getOrgs = state => state.orgs;
const getFilterText = state => state.filterText;
const getFilterOrg = state => state.filterOrg;
const getFilterTime = state => state.filterTime;
const getGithubToken = state => state.githubToken;

export default {
  getIssues,
  getOrgs,
  getFilterText,
  getFilterOrg,
  getFilterTime,
  getGithubToken,
};
