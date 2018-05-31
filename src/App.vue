<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
      <router-view></router-view>
  </div>
</template>

<script>
import Vue from 'vue';
import MyVuetable from './components/MyVuetable';
import FieldDefs from './components/FieldDefs';
import DetailRow from './components/DetailRow';

Vue.component('my-detail-row', DetailRow);

export default {
  name: 'app',
  components: {
    MyVuetable,
  },
  data() {
    return {
      fields: FieldDefs,
      sortOrder: [
        {
          field: 'email',
          sortField: 'salary',
          direction: 'asc',
        },
      ],
      moreParams: {},
    };
  },
};
</script>

<style>
body {
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

main {
  text-align: center;
  margin-top: 40px;
}

header {
  margin: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  background-color: #35495E;
  color: #ffffff;
}

header span {
  display: block;
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: .02em;
  font-weight: 400;
  box-sizing: border-box;
  padding-top: 16px;
}
</style>
