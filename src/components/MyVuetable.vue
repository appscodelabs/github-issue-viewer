<template>
  <div class="container">
    <br/>

    <github-token></github-token>

    <div class="container">
      <div class="row">
        <div class="col-md-11">
          <tags-input element-id="tags"
            v-model="orgs"
            placeholder="      Add Organization"
            :typeahead="false">
          </tags-input>
        </div>
      </div>
    </div>
    <br/>

    <div class="container" style="margin-bottom:10px">
      <form>
        <div class="form-inline">

          <filter-org></filter-org>
          <filter-time></filter-time>
          <filter-bar></filter-bar>

        </div>
    </form>

    </div>

    <Vuetable ref="vuetable"
      :api-mode="false"
      :data="getIssues"
      data-path="data"
      :fields="fields"
      pagination-path=""
      :row-class="onRowClass"
      :per-page="20"
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
import VoerroTagsInput from '@voerro/vue-tagsinput';

import GithubToken from './GithubToken';
import FilterBar from './FilterBar';
import FilterTime from './FilterTime';
import FilterOrg from './FilterOrg';
// import FieldDefs from './FieldDefs';
import VuetablePaginationBootstrap from './VuetablePaginationBootstrap';

Vue.component('tags-input', VoerroTagsInput);
Vue.use(VueEvents);
// Vue.component('my-detail-row', DetailRow);
Vue.component('github-token', GithubToken);
Vue.component('filter-bar', FilterBar);
Vue.component('filter-time', FilterTime);
Vue.component('filter-org', FilterOrg);

export default {
  name: 'my-vuetable',
  components: {
    Vuetable,
    VuetablePaginationInfo,
    VuetablePaginationBootstrap,
  },
  created() {
    // this.$store.dispatch('getRepoIssues');
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
      repos: [],
    };
  },
  computed: {
    getIssues() {
      return this.$store.getters.getIssues;
    },
    orgs: {
      get: function get() {
        return this.$store.getters.getOrgs;
      },
      set: function set(value) {
        console.log('value: ', value);
        this.$store.dispatch('setOrgs', value.join(','));
      },
    },
  },
  mounted() {
    this.$events.$on('filter-set', eventData => this.onFilterSet(eventData));
    this.$events.$on('filter-reset', e => this.onFilterReset(e));
  },
  methods: {
    onRowClass(dataItem, index, a, b) {
      console.log('dataItem: ', dataItem);
      console.log('index: ', index);
      console.log('b: ', b);
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

<style>
.tag {
  font-size: 14px;
  padding: .3em .4em .4em;
  margin: 0 .1em;
}
.tag a {
  color: #bbb;
  cursor: pointer;
  opacity: 0.6;
}
.tag a:hover {
  opacity: 1.0
}
.tag .remove {
  vertical-align: bottom;
  top: 0;
}
.tag a {
  margin: 0 0 0 .3em;
}
.tag a .glyphicon-white {
  color: #fff;
  margin-bottom: 2px;
}
.form-control {
  width: 50%;
}
</style>
