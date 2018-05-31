<template>
  <div class="form-group col-md-4">
    <label for="filter-time">Filter :</label>
    <select id="filter-time" @change="handleTimeChange"  v-model="filterTime" class="form-control">
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
          this.$store.dispatch('setFilterTime', value);
        },
      },
    },
    methods: {
      handleTimeChange(e) {
        const time = e.currentTarget.value;
        const query = {};
        if (this.$route.query) {
          Object.assign(query, this.$route.query);
        }
        if (time) {
          Object.assign(query, { time });
        } else {
          delete query.time;
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
