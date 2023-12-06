<script>
export default {
  props: {
    text: String,
    position: {
      type: String,
      default: "top",
    },
    tooltipType: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    /**
     * Xử lý việc hiện thị tooltip
     * Author: ptrung26 (20/08/2023)
     */
    handleShowTooltip(pos) {
      if (!this.$refs.tooltipContainer) {
        return;
      }

      if (!this.tooltipPosition) {
        // Lấy ra vị trí của phần tử hiện tại để xét vị trí của tooltip tương ứng
        const rect = this.$refs.tooltipContainer.getBoundingClientRect();
        let top = rect.bottom + "px";
        let left = rect.left + "px";

        // Tùy chỉnh vị trí dựa trên tham số position
        if (pos === "middle") {
          top = rect.top + rect.height / 2 + "px";
        } else if (pos === "bottom") {
          let distance = 10;
          top = rect.bottom + distance + "px";
        }
        this.tooltipPosition = {
          top,
          left,
        };
      }

      if (this.message) {
        this.isShowTooltip = true;
      }
    },

    /**
     * Xử lý việc tắt tooltip
     * Author: ptrung26 (20/08/2023)
     */
    handleHiddenTooltip() {
      this.isShowTooltip = false;
    },
  },
  watch: {
    text: {
      handler(newValue) {
        this.message = newValue;
      },
    },
  },
  data() {
    return {
      isShowTooltip: this.isShow,
      tooltipPosition: null,
      message: this.text,
    };
  },
  beforeUpdate() {
    if (!this.message) {
      this.isShowTooltip = false;
    }
  },
};
</script>

<template>
  <div
    @mouseover.stop="handleShowTooltip(position)"
    @mouseleave.stop="handleHiddenTooltip"
    ref="tooltipContainer"
    class="w-full"
  >
    <slot name="children"></slot>
    <Teleport to="body">
      <div
        v-show="isShowTooltip"
        class="m-tooltip"
        :class="{
          'm-tooltip--error': tooltipType === $MISAEnum.TooltipType.Error,
        }"
        :style="tooltipPosition"
      >
        {{ text }}
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
@import url(@/css/components/tooltip.css);
</style>
