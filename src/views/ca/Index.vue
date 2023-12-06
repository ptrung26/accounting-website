<template>
  <div class="ca">
    <ul class="ca-nav">
      <li
        class="ca-nav-item"
        v-for="(item, index) in caNav"
        :key="index"
        :class="{ active: index === selectedIdx }"
      >
        <router-link :to="item.to" @click="handleNavItem(index)">{{
          item.label
        }}</router-link>
      </li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "CA",
  methods: {
    handleNavItem(index) {
      this.selectedIdx = index;
    },
  },
  data() {
    return {
      caNav: [
        {
          label: this.$MISAResource.VI.CaNav.Process,
          to: "CAProcess",
        },
        {
          label: this.$MISAResource.VI.CaNav.CollectAndSpendMoney,
          to: "CaPayment",
        },
      ],
      selectedIdx: 0,
    };
  },
  created() {
    if (this.$route.path.includes("CAProcess")) {
      this.selectedIdx = 0;
    } else {
      this.selectedIdx = 1;
    }
  },
};
</script>

<style scoped>
@import url(@/css/views/ca/index.css);
</style>
