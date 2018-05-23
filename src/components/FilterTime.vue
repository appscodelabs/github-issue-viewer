<template>
  <div class="form-group col-md-4">
    <label for="filter-time">Filter :</label>
    <select id="filter-time" v-model="filterTime" class="form-control">
      <option value=''>All</option>
      <option value='7days'>Last 7 days</option>
      <option value='15days'>Last 15 days</option>
      <option value='30days'>Last 30 days</option>
      <option value='recent5'>Most Recent 5</option>
      <option value='recent10'>Most Recent 10</option>
    </select>
  </div>
</template>

  <script>
  export default {
    data() {
      return {};
    },
    computed: {
      filterTime: {
        get: function get() {
          return this.$store.getters.getFilterTime;
        },
        set: function set(value) {
          console.log('setttt: ', value);
          this.$store.dispatch('setFilterTime', value);
        },
      },
    },
  };
</script>
