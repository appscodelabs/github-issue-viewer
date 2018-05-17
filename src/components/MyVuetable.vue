<template>
  <div>
    <Vuetable ref="vuetable"
    api-url="https://vuetable.ratiw.net/api/users"
    :fields="fields"
    :sort-order="sortOrder"
    pagination-path=""
    :per-page="10"
    detail-row-component="my-detail-row"
    @vuetable:cell-clicked="onCellClicked"
    @vuetable:pagination-data="onPaginationData"
    >
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
      <vuetable-pagination-info ref="paginationInfo"
      ></vuetable-pagination-info>

      <VuetablePagination ref="pagination"
        @vuetable-pagination:change-page="onChangePage"
      ></VuetablePagination>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Vuetable from 'vuetable-2/src/components/Vuetable';
import VuetablePagination from 'vuetable-2/src/components/VuetablePaginationDropdown';
import VuetablePaginationInfo from 'vuetable-2/src/components/VuetablePaginationInfo';
// import CustomActions from './CustomActions';
import DetailRow from './DetailRow';

Vue.component('my-detail-row', DetailRow);

export default {
  components: {
    Vuetable,
    VuetablePagination,
    VuetablePaginationInfo,
  },
  data() {
    return {
      fields: [
        'name', 'email', 'birthdate',
        {
          name: 'age',
          sortField: 'age',
          titleClass: 'center aligned',
          dataClass: 'center aligned',
        },
        {
          name: 'salary',
          sortField: 'salary',
          titleClass: 'center aligned',
          dataClass: 'right aligned',
          callback: 'handleSalary',
          direction: 'des',
        },
        {
          name: '__component:custom-actions',
          title: 'Actions',
          titleClass: 'center aligned',
          dataClass: 'center aligned',
        },
      ],
      sortOrder: [
        {
          field: 'salary',
          sortField: 'salary',
          direction: 'asc',
        },
      ],
    };
  },
  methods: {
    handleSalary(value) {
      return `${value} 000`;
    },
    onPaginationData(paginationData) {
      this.$refs.pagination.setPagination(paginationData);
    },
    onChangePage(page) {
      this.$refs.pagination.changePage(page);
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
  },
};
</script>
