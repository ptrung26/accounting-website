<template>
  <the-header />
  <div class="main">
    <the-sidebar />
    <the-container />
  </div>
</template>

<script>
import TheHeader from "./TheHeader.vue";
import TheSidebar from "./TheSidebar.vue";
import TheContainer from "./TheContainer.vue";
export default {
  name: "App",
  components: {
    TheHeader,
    TheSidebar,
    TheContainer,
  },
};
</script>
