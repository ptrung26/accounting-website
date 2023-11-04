import CA from "@/views/ca/Index.vue";
import Layout from "@/layouts/Layout.vue";
import CAProcess from "@/views/ca/CAProcess.vue";
import CAReceive from "@/views/ca/CAReceive.vue";
import CAUser from "@/views/ca/CAUser.vue";
import CAPaymentDetail from "@/views/ca/CAPaymentDetail.vue";

import * as VueRouter from "vue-router";

const routes = [
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "CA",
        component: CA,
        children: [
          { path: "CAProcess", component: CAProcess },
          { path: "CAReceive", component: CAReceive },
        ],
      },
      { path: "CAUser", component: CAUser },
    ],
  },
  {
    path: "/CAPaymentDetail/:id?",
    CAPaymentDetail,
    component: CAPaymentDetail,
  },
];
const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

export default router;
