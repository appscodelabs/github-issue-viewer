<template>
  <div class="form-group col-md-4">
    <label for="inputState">Filter</label>
    <select id="inputState" class="form-control">
      <option selected>All</option>
      <option>Last 7 days</option>
      <option>Last 15 days</option>
      <option>Last 30 days</option>
      <option>Most Recent 5</option>
      <option>Most Recent 10</option>
    </select>
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
          console.log('setttt: ', value);
          this.$store.dispatch('setFilterText', value);
        },
      },
    },
  };
</script>
