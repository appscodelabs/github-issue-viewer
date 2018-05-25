<template>
    <div class="form-group col-md-3">
      <label for="inputEmail4">Search :</label>
      <input type="text" v-model="filterText" class="form-control" id="inputEmail4" placeholder=" Search in Title, Issue #">
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
