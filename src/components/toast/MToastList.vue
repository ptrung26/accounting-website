<script>
import Toast from "./MToast.vue";
export default {
  props: {
    list: Array,
    position: String,
  },
  methods: {},
  components: {
    Toast,
  },
};
</script>
<template>
  <div class="m-toast-list" :class="`m-toast-list--${position}`">
    <Toast
      v-for="item in list"
      :key="item.id"
      :id="item.id"
      :status="item.status"
      :title="item.title"
      :message="item.message"
    ></Toast>
  </div>
</template>

<style scope>
@import url(@/css/components/toast.css);
</style>
