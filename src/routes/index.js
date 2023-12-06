import CA from "@/views/ca/Index.vue";
import Layout from "@/layouts/Layout.vue";
import CAProcess from "@/views/ca/CAProcess.vue";
import CaPayment from "@/views/ca/CAPayment.vue";
import CAAccount from "@/views/ca/CAAccount.vue";
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
          { path: "CaPayment", component: CaPayment },
        ],
      },
      { path: "CAAccount", component: CAAccount },
    ],
  },
  {
    path: "/CAPaymentDetail/:id?",
    name: "CAPaymentDetail",
    component: CAPaymentDetail,
    props: true,
  },
];
const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

export default router;
