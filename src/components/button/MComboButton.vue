<script>
export default {
  props: {
    text: {
      type: String,
      default: "",
    },
    options: {
      type: Array,
      default: () => [],
    },
    defaultValue: {
      type: Object,
      default: () => ({}),
    },
    comboboxType: {
      type: Number,
      default: 0,
    },
    icon: {
      type: String,
      default: "",
    },
    disable: {
      type: Boolean,
      default: false,
    },
    style: {
      type: String,
      default: "",
    },
    tabindex: {
      type: Number,
      default: -1,
    },
  },
  emits: ["call-action", "combobtn-click", "combobtn-focus"],
  data() {
    return {
      isOpen: false,
      currentOption: this.defautlValue,
    };
  },
  methods: {
    /**
     * Mở menu đổ ra
     * Author: ptrung26 (20/11/2023)
     */
    handleOpenMenu() {
      this.isOpen = !this.isOpen;
    },

    /**
     * Xử lý thực thi action trên menu hoặc ở button
     * Author: ptrung26 (20/11/2023)
     */
    handleExecuteAction(option) {
      this.currentOption = option;
      this.$emit("call-action", option);
      this.isOpen = false;
    },
  },
  watch: {
    defaultValue: {
      handler(newValue, oldValue) {
        if (JSON.stringify(newValue) !== JSON.stringify(oldValue))
          this.currentOption = { ...newValue };
      },
      immediate: true,
    },
  },
};
</script>

<template>
  <div
    v-if="comboboxType === 1"
    class="m-btn"
    :class="{
      isDisable: disable,
      [style]: true,
    }"
    v-click-outside="() => (this.isOpen = false)"
    :tabindex="tabindex"
  >
    <button
      class="m-current-action"
      @click="handleExecuteAction(this.currentOption)"
      :tabindex="tabindex"
      @focus="$emit('combobtn-focus')"
    >
      {{ currentOption.text }}
    </button>
    <div class="seperate"></div>
    <div class="m-btn-action">
      <span class="m-icon m-icon-arrow-down" @click="handleOpenMenu"></span>
    </div>
    <div class="menu-action" v-if="isOpen">
      <ul>
        <ul class="button-list">
          <li
            class="button-item"
            v-for="(item, index) in options"
            :key="index"
            @click="handleExecuteAction(item)"
          >
            {{ item.text }}
          </li>
        </ul>
      </ul>
    </div>
  </div>
  <div v-if="comboboxType === 0" :tabindex="tabindex">
    <button
      class="m-combo-btn m-btn-type-1"
      :class="{ isDisable: disable, [style]: true }"
      @click.stop="$emit('combobtn-click', $event)"
      @focus="$emit('combobtn-focus')"
      :tabindex="tabindex"
    >
      <span>{{ text }}</span>
      <span class="m-icon" :class="icon"></span>
      <slot name="action"></slot>
    </button>
  </div>
</template>

<style scoped>
.m-btn {
  display: inline-flex;
  align-items: center;
  padding: 4px 0 4px 4px;
  position: relative;
  min-width: 0;
}

.isDisable {
  color: #afafaf;
  cursor: default;
  pointer-events: none;
}

.m-btn:active {
  outline: none;
}
.m-btn:hover {
  background: var(--primary-color);
}

.m-current-action {
  font-weight: 400;
  font-size: 12px;
  color: #fff;
  width: 80px;
}
.seperate {
  width: 1px;
  height: 100%;
  background-color: #fff;
}
.m-btn-action {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.m-icon {
  position: relative;
  top: -1px;
}

.menu-action {
  background: #fff;
  position: absolute;
  right: 0;
  bottom: 98%;
  width: 120px;
  color: #000;
  font-family: Misa font;
  font-size: 12px;
  border-radius: 2px;
  border: 1px solid #babec5;
}

.button-item {
  padding: 8px;
}

.button-item:hover {
  color: var(--primary-color);
  background: #c5c4c4;
}
</style>
