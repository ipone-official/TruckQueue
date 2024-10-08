import Vue from 'vue';
import Router from 'vue-router';
import Login from '../pages/core/Login.vue';
import Error from '../pages/core/Error.vue';
import DisplayQueue from '../pages/DisplayQueue.vue'
import UploadQueue from '../pages/QueueUpload.vue'
import ManageQueue from '../pages/ManageQueue.vue'
import ShowQueue from '../pages/ShowQueue.vue'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/ShowQueue',
      name: 'ShowQueue',
      component: ShowQueue,
     
      meta: {
        allowAnonymous: true,
        breadcrumb: [
          { name: 'Show Queue' }
        ]
      }
    },
    {
      path: '/DisplayQueue',
      name: 'DisplayQueue',
      component: DisplayQueue,
      meta: {
        breadcrumb: [
          { name: 'Display Queue' }
        ]
      }
    },
    {
      path: '/UploadQueue',
      name: 'UploadQueue',
      component: UploadQueue,
      meta: {
        breadcrumb: [
          { name: 'Truck Queue' }
        ]
      }
    },
    {
      path: '/ManageQueue',
      name: 'ManageQueue',
      component: ManageQueue,
      meta: {
        breadcrumb: [
          { name: 'Manage Queue' }
        ]
      }
    },
    {
      path: '/',
      name: 'Login',
      component: Login,
      meta: {
        allowAnonymous: true
      }
    },
    {
      path: '/error',
      name: 'Error',
      component: Error,
      meta: {
        allowAnonymous: true
      }
    },
  ]
});
