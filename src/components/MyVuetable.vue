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
      detail-row-component="my-detail-row"
      @vuetable:cell-clicked="onCellClicked"
      @vuetable:pagination-data="onPaginationData"
    >
      <template slot="index" scope="props">
        {{ props.rowIndex + 1 }}
      </template>
      <template slot="titlelink" scope="props">
        <div>
          <a @click="handleClickOnTitle(props)" :href="props.rowData.htmlUrl" target="_blank">
            <span v-if="props.rowData.isPR" class="badge badge-light">PR</span> {{ props.rowData.title }}
            <template v-for="(label, index) in props.rowData.labels">
              <span class="badge" :style="getLabelStyle(label)" :key="index">{{ label.name }}</span> {{ &nbsp }}
            </template>
          </a>
        </div>
      </template>

      <template slot="issueNumber" scope="props">
        <div>
          <a @click="handleClickOnTitle(props)" :href="props.rowData.htmlUrl" target="_blank">{{props.rowData.orgName}}/{{ props.rowData.repoName}}#{{props.rowData.number}}</a>
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
    <br/>
    <br/>
    <!--
    <div class="vuetable-pagination ui basic segment grid">
      <vuetable-pagination-bootstrap ref="pagination"
        class="pull-right"
        @vuetable-pagination:change-page="onChangePage"
      ></vuetable-pagination-bootstrap>
    </div>
    -->
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

import FieldDefs from './FieldDefs';
import GithubToken from './GithubToken';
import FilterBar from './FilterBar';
import FilterTime from './FilterTime';
import FilterOrg from './FilterOrg';
// import FieldDefs from './FieldDefs';
import VuetablePaginationBootstrap from './VuetablePaginationBootstrap';
// import func from './vue-temp/vue-editor-bridge';

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
    console.log('created');
    // this.$store.dispatch('getRepoIssues');
    console.log('query', this.$route.query);
    const query = this.$route.query;
    if (query) {
      if (query.org) {
        let orgs = this.$store.getters.getOrgs;
        if (!orgs) {
          this.$store.dispatch('setOrgs', query.org);
        } else if (!orgs.split(',').includes(query.org)) {
          orgs = `${orgs},${query.org}`;
          this.$store.dispatch('setOrgs', orgs);
        }
        this.$store.dispatch('setFilterOrg', query.org);
      } else {
        this.$store.dispatch('setFilterOrg', '');
      }
      if (query.time) {
        this.$store.dispatch('setFilterTime', query.time);
      } else {
        this.$store.dispatch('setFilterTime', '');
      }
    }
  },
  props: {
    /*
    apiUrl: {
      type: String,
      required: true,
    },
    */
  },
  data() {
    return {
      // fields: FieldDefs,
      repos: [],
      fields: FieldDefs,
    };
  },
  watch: {
    /* eslint-disable */
    $route: function (to, from) {
      console.log('to: ', to);
      console.log('from: ', from);

      const query = to.query;
      if (query) {
        if (query.org) {
          let orgs = this.$store.getters.getOrgs;
          if (!orgs) {
            this.$store.dispatch('setOrgs', query.org);
          } else if (!orgs.split(',').includes(query.org)) {
            orgs = `${orgs},${query.org}`;
            this.$store.dispatch('setOrgs', orgs);
          }
          this.$store.dispatch('setFilterOrg', query.org);
        } else {
          this.$store.dispatch('setFilterOrg', '');
        }
        if (query.time) {
          this.$store.dispatch('setFilterTime', query.time);
        } else {
          this.$store.dispatch('setFilterTime', '');
        }
      }
    },
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
        this.$store.dispatch('setOrgs', value.join(','));
      },
    },
  },
  mounted() {
    console.log('mountedddd');
    this.$events.$on('filter-set', eventData => this.onFilterSet(eventData));
    this.$events.$on('filter-reset', e => this.onFilterReset(e));
  },
  methods: {
    async onRowClass(dataItem /* index */) {
      const htmlUrl = dataItem.htmlUrl;
      const updatedAt = dataItem.updatedAt;

      function choiceRowClass() {
        return new Promise((resolve) => {
          const idb = global.indexedDB ||
                      global.mozIndexedDB ||
                      global.webkitIndexedDB ||
                      global.msIndexedDB;

          const open = idb.open('issues-clicked-timestamp', 1);
          let db = '';
          open.onsuccess = function openSuccess() {
            db = open.result;
            const tx = db.transaction('issue', 'readonly');
            const store = tx.objectStore('issue');
            const getClickedTimestamp = store.get(htmlUrl);
            getClickedTimestamp.onsuccess = function getClickedTimestampSuccess() {
              const clickedTimestamp = getClickedTimestamp.result;

              if (clickedTimestamp && clickedTimestamp < updatedAt) {
                resolve('updated-later');
              }
            };
            getClickedTimestamp.onerror = function getClickedTimestampError(e) {
              console.log('error: ', e);
            };

            tx.oncomplete = function c() {
              db.close();
            };
          };
        });
      }

      const className = await choiceRowClass();
      document.querySelector(`a[href="${htmlUrl}"]`).classList.add(className);
      return className;
    },
    handleClickOnTitle(value) {
      document.querySelector(`a[href="${value.rowData.htmlUrl}"]`).classList.remove('updated-later');

      const idb = global.indexedDB ||
        global.mozIndexedDB ||
        global.webkitIndexedDB ||
        global.msIndexedDB;

      const open = idb.open('issues-clicked-timestamp', 1);
      let db = '';
      open.onupgradeneeded = function a() {
        db = open.result;
        db.createObjectStore('issue', { autoIncrement: true });
      };

      open.onsuccess = function b() {
        db = open.result;
        const tx = db.transaction('issue', 'readwrite');
        const store = tx.objectStore('issue');

        store.put(value.rowData.updatedAt, value.rowData.htmlUrl);

        tx.oncomplete = function c() {
          db.close();
        };
      };
    },
    onPaginationData(paginationData) {
      this.$refs.pagination.setPaginationData(paginationData);
    },
    onChangePage(page) {
      this.$refs.vuetable.changePage(page);
    },
    onAction(/* action, data, index */) {
      // console.log(`slot) action: ${action} ${data.name} ${index}`);
    },
    onCellClicked(data /* field, event */) {
      this.$refs.vuetable.toggleDetailRow(data.id);
    },
    onFilterSet(filterText) {
      this.appendParams.filter = filterText;
      Vue.nextTick(() => this.$refs.vuetable.refresh());
    },
    onFilterReset() {
      delete this.appendParams.filter;
      Vue.nextTick(() => this.$refs.vuetable.refresh());
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
    getLabelStyle(label) {
      return { 'background-color': `#${label.color}` };
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
.updated-later {
  color: blue;
  font-weight: 700
}
</style>
