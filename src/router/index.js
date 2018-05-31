import Vue from 'vue';
import Router from 'vue-router';
import Hello from '@/components/Hello';
import MyVuetable from '@/components/MyVuetable';

Vue.use(Router);

export default new Router({
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    return savedPosition;
  },
  routes: [
    {
      path: '/',
      name: 'MyVuetable',
      component: MyVuetable,
    },
    {
      path: '/search/:a?',
      name: 'Search',
      component: MyVuetable,
    },
    {
      path: '/test',
      name: 'Hello',
      component: Hello,
    },
  ],
});
