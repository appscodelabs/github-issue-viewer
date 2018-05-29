<template>
    <div class="form-group pull-right">
      <label for="filterText">Search: </label>
      <input type="text" v-model="filterText" class="form-control" id="filterText" placeholder="Title, Issue #, Repository">
    </div>
</template>

  <script>
  export default {
    data() {
      return {};
    },
    computed: {
      filterText: {
        get: function get() {
          return this.$store.getters.getFilterText;
        },
        set: function set(value) {
          this.$store.dispatch('setFilterText', value);
        },
      },
    },
  };
</script>
