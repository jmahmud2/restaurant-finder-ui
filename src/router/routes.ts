import { RouteRecordRaw } from 'vue-router';
import RestaurantFinderPage from 'src/pages/RestaurantFinderPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: RestaurantFinderPage,
  },
];

export default routes;