<template>
  <div class="form-group pull-left">
    <label for="filer-org">Type: </label>
    <select class="form-control" v-model="filterType" @change="handleTypeChange">
      <option value=''>All</option>
      <option value="pr">PR</option>
      <option value="issue">Issue</option>
    </select>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['getFilterType']),
    filterType: {
      get() {
        return this.getFilterType;
      },
      set(type) {
        this.$store.dispatch('setFilterType', type);
      },
    },
  },
  methods: {
    handleTypeChange(e) {
      const type = e.currentTarget.value;
      const query = {};
      if (this.$route.query) {
        Object.assign(query, this.$route.query);
      }
      if (type) {
        Object.assign(query, { type });
      } else {
        delete query.type;
      }

      if (Object.keys(query).length) {
        this.$router.push({ name: 'Search', query });
      } else {
        this.$router.push({ name: 'MyVuetable' });
      }
    },
  },
};
</script>