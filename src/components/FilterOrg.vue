<template>
  <div class="form-group pull-left">
    <label for="filer-org">Organization: </label>
    <select id="filer-org" v-model="filterOrg" @change="handleOrgChange" class="form-control">
      <option value=''>All</option>
      <option v-for="org in orgs" :key="org">{{ org }}</option>
    </select>
  </div>
</template>

  <script>
  export default {
    data() {
      return {};
    },
    computed: {
      orgs() {
        return this.$store.getters.getOrgs.split(',');
      },
      filterOrg: {
        get: function get() {
          return this.$store.getters.getFilterOrg;
        },
        set: function set(orgName) {
          this.$store.dispatch('setFilterOrg', orgName);
        },
      },
    },
    methods: {
      handleOrgChange(e) {
        const org = e.currentTarget.value;
        const query = {};
        if (this.$route.query) {
          Object.assign(query, this.$route.query);
        }
        if (org) {
          Object.assign(query, { org });
        } else {
          delete query.org;
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
<style>
.form-group {
  padding: 15px
}
</style>
