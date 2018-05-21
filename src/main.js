// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
/* eslint-disable no-unused-vars */
import CustomActions from './components/CustomActions';
import store from './store/store';

Vue.config.productionTip = false;
Vue.component('custom-actions', CustomActions);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
