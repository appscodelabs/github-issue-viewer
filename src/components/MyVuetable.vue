<template>
  <div>
    <filter-bar></filter-bar>
    <Vuetable ref="vuetable"
    :api-mode="false"
    :data="issues"
    data-path="data"
    :fields="fields"
    pagination-path=""
    :per-page="10"
    :multi-sort="true"
    :sort-order="sortOrder"
    :append-params="appendParams"
    detail-row-component="my-detail-row"
    @vuetable:cell-clicked="onCellClicked"
    @vuetable:pagination-data="onPaginationData"
    >
      <template slot="titlelink" scope="props">
        <div>
          <a :href="props.rowData.html_url" target="_blank">{{ props.rowData.title }}</a>
        </div>
      </template>
      <template slot="actions" scope="props">
        <div class="custom-actions">
          <button class="ui basic button"
            @click="onAction('view-item', props.rowData, props.rowIndex)">
            <i class="zoom icon"></i>
          </button>
          <button class="ui basic button"
            @click="onAction('edit-item', props.rowData, props.rowIndex)">
            <i class="edit icon"></i>
          </button>
          <button class="ui basic button"
            @click="onAction('delete-item', props.rowData, props.rowIndex)">
            <i class="delete icon"></i>
          </button>
        </div>
      </template>
    </Vuetable>

    <div class="vuetable-pagination ui basic segment grid">
      <vuetable-pagination-bootstrap ref="pagination"
        class="pull-right"
        @vuetable-pagination:change-page="onChangePage"
      ></vuetable-pagination-bootstrap>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Vuetable from 'vuetable-2/src/components/Vuetable';
// import VuetablePagination from 'vuetable-2/src/components/VuetablePaginationDropdown';
import VuetablePaginationInfo from 'vuetable-2/src/components/VuetablePaginationInfo';
// import CustomActions from './CustomActions';
import VueEvents from 'vue-events';
import axios from 'axios';
// import DetailRow from './DetailRow';
import FilterBar from './FilterBar';
// import FieldDefs from './FieldDefs';
import VuetablePaginationBootstrap from './VuetablePaginationBootstrap';

Vue.use(VueEvents);
// Vue.component('my-detail-row', DetailRow);
Vue.component('filter-bar', FilterBar);

export default {
  name: 'my-vuetable',
  components: {
    Vuetable,
    VuetablePaginationInfo,
    VuetablePaginationBootstrap,
  },
  props: {
    /*
    apiUrl: {
      type: String,
      required: true,
    },
    */
    fields: {
      type: Array,
      required: true,
    },
    sortOrder: {
      type: Array,
      default() {
        return [];
      },
    },
    appendParams: {
      type: Object,
      default() {
        return {};
      },
    },
    detailRowComponent: {
      type: String,
    },
  },
  data() {
    return {
      // fields: FieldDefs,
      orgs: {},
      issues: [],
      repos: [],
    };
  },
  mounted() {
    this.$events.$on('filter-set', eventData => this.onFilterSet(eventData));
    this.$events.$on('filter-reset', e => this.onFilterReset(e));
    // const orgs = ['appscode', 'kubedb'];
    // this.getOrgRepos('appscode');
    this.getRepoIssues('appscode', 'voyager');
  },
  methods: {
    getRepoIssues(orgName, repoName) {
      console.log('thisss: ', this);
      axios.get(`https://api.github.com/repos/${orgName}/${repoName}/issues`)
        .then((resp) => {
          console.log('resppp: ', resp);
          this.issues = resp;
        })
        .catch((e) => {
          console.log('eeee: ', e);
        });
    },
    getOrgRepos(orgName) {
      axios.get(`https://api.github.com/orgs/${orgName}/repos`)
        .then((resp) => {
          this.orgs[orgName] = resp.data;
          return this.orgs[orgName].repos;
        })
        .then((repos) => {
          repos.forEach((repoName) => {
            this.getRepoIssues(orgName, repoName);
          });
        })
        .catch((e) => {
          console.log('eee: ', e);
        });
    },
    handleTitle(value, a, b) {
      console.log('value: ', value);
      console.log('a: ', a);
      console.log('b: ', b);
      return value;
    },
    handleSalary(value) {
      return `${value} 000`;
    },
    onPaginationData(paginationData) {
      this.$refs.pagination.setPaginationData(paginationData);
    },
    onChangePage(page) {
      this.$refs.vuetable.changePage(page);
    },
    onAction(action, data, index) {
      console.log(`slot) action: ${action} ${data.name} ${index}`);
    },
    onCellClicked(data, field, event) {
      console.log('cellClicked: data: ', data);
      console.log('cellClicked: field: ', field.name);
      console.log('cellClicked: event: ', event);
      this.$refs.vuetable.toggleDetailRow(data.id);
    },
    onFilterSet(filterText) {
      console.log('filter-set: ', filterText);
      this.appendParams.filter = filterText;
      Vue.nextTick(() => this.$refs.vuetable.refresh());
    },
    onFilterReset() {
      delete this.appendParams.filter;
      Vue.nextTick(() => this.$refs.vuetable.refresh());
      console.log('filter-reset: ');
    },
    renderPagination(h) {
      return h(
        'div',
        { class: { 'vuetable-pagination': true } },
        [
          h('vuetable-pagination-info', { ref: 'paginationInfo', props: { css: this.css.paginationInfo } }),
          h('vuetable-pagination-bootstrap', {
            ref: 'pagination',
            class: { 'pull-right': true },
            props: {},
            on: {
              'vuetable-pagination:change-page': this.onChangePage,
            },
          }),
        ],
      );
    },
  },
};
</script>
