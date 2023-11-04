const focus = {
  mounted: (el) => el.focus(),
};

/**
 * Xử lý khi click ra bên ngoài phần tử thì tự động đóng
 * Author: ptrung26 (24/08/2023)
 */
const clickOutside = {
  mounted: function (el, binding) {
    el.clickOutsideEvent = function (event) {
      if (!(el == event.target || el.contains(event.target))) {
        binding.value(event, el);
      }
    };
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted: function (el) {
    document.removeEventListener("click", el.clickOutsideEvent);
  },
};

/**
 * Xử lý khi ấn vào nút esc
 * Author: ptrung26 (28/09/2023)
 */
const escKeyBoard = {
  mounted: function (el, binding) {
    el.escKeyBoardEvent = function (event) {
      if (event.key === "Escape") {
        binding.value(event, el);
      }
    };
    document.addEventListener("keydown", el.escKeyBoardEvent);
  },
  unmounted: function (el) {
    document.removeEventListener("keydown", el.escKeyBoardEvent);
  },
};

/**
 * Xử lý khi ấn vào nút enter
 * Author: ptrung26 (28/09/2023)
 */
const enterKeyboard = {
  mounted: function (el, binding) {
    el.escKeyBoardEvent = function (event) {
      if (el == event.target || el.contains(event.target)) {
        event.stopPropagation();
        if (event.key === "Enter") {
          binding.value(event, el);
        }
      }
    };
    document.addEventListener("keydown", el.escKeyBoardEvent);
  },
  unmounted: function (el) {
    document.removeEventListener("keydown", el.escKeyBoardEvent);
  },
};

/**
 * Xử lý khi ấn vào nút mũi tên lên xuống
 * Author: ptrung26 (28/09/2023)
 */
const arrowKeyboard = {
  mounted: function (el, binding) {
    el.arrowKeyBoardEvent = function (event) {
      if (el == event.target || el.contains(event.target)) {
        event.stopPropagation();
        if (event.key === "ArrowDown") {
          // Xử lý khi ấn phím mũi tên xuống
          binding.value("down");
        } else if (event.key === "ArrowUp") {
          // Xử lý khi ấn phím mũi tên lên
          binding.value("up");
        }
      }
    };
    document.addEventListener("keydown", el.arrowKeyBoardEvent);
  },
  unmounted: function (el) {
    document.removeEventListener("keydown", el.arrowKeyBoardEvent);
  },
};

export { focus, clickOutside, escKeyBoard, enterKeyboard, arrowKeyboard };
