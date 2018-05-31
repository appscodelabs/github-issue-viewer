import Vue from 'vue';
import Router from 'vue-router';
import Hello from '@/components/Hello';
import MyVuetable from '@/components/MyVuetable';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'MyVuetable',
      component: MyVuetable,
    },
    {
      path: '/test',
      name: 'Hello',
      component: Hello,
    },
  ],
});
