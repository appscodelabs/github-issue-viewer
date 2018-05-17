<template>
  <div>
    <Vuetable ref="vuetable"
    api-url="https://vuetable.ratiw.net/api/users"
    :fields="fields"
    :sort-order="sortOrder"
    pagination-path=""
    :per-page="10"
    @vuetable:pagination-data="onPaginationData"
    ></Vuetable>
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
import Vuetable from 'vuetable-2/src/components/Vuetable';
import VuetablePagination from 'vuetable-2/src/components/VuetablePaginationDropdown';
import VuetablePaginationInfo from 'vuetable-2/src/components/VuetablePaginationInfo';
// import CustomActions from './CustomActions';

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
      console.log('valuuuuu: ', value);
      return `${value} 000`;
    },
    onPaginationData(paginationData) {
      this.$refs.pagination.setPagination(paginationData);
    },
    onChangePage(page) {
      this.$refs.pagination.changePage(page);
    },
  },
};
</script>
