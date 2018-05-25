<template>
  <div class="form-group col-md-4">
    <label for="org-name">Organization :</label>
    <select id="org-name" v-model="filterOrg" class="form-control">
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
          console.log('set filterOrgName: ', orgName);
          this.$store.dispatch('setFilterOrg', orgName);
        },
      },
    },
  };
</script>
