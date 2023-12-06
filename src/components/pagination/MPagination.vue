<script>
export default {
  props: {
    totalPage: { type: Number },
    pageRange: { type: Number },
    marginPages: {
      type: Number,
      default: 1,
    },
    currentPage: { type: Number, default: 1 },
  },
  emits: ["page-change"],
  data() {
    return {
      mCurrentPage: this.currentPage,
    };
  },
  methods: {
    /**
     * Xử lý việc thay đổi trang hiện tại
     * Author: ptrung26 (03/09/2023)
     * @param {*} page trang muốn chuyển
     */
    onPageChange(page) {
      this.mCurrentPage = page;
      this.$emit("page-change", page);
    },

    /**
     * Xử lý việc ấn nút trước hoặc sau để chuyển sang trang khác
     * Author: ptrung26 (03/09/2023)
     */
    onMovePage(direction) {
      let page = this.mCurrentPage;
      page += direction;
      if (page < 1 || page > this.totalPage) {
        page -= direction;
      }
      this.onPageChange(page);
    },
  },
  watch: {
    currentPage: {
      handler(newValue) {
        this.mCurrentPage = newValue;
      },
    },
  },
  computed: {
    /**
     * Xử lý hiện thị số lượng trang hiển thị trước và sau trang hiện tại
     * Author: ptrung26 (03/09/2023)
     */
    pagesToShow() {
      const pages = {};

      // Nếu số lượng trang nhỏ hơn đồ dài trang cần hiện thị
      if (this.totalPage <= this.pageRange) {
        for (let index = 0; index < this.totalPage; index++) {
          let page = {
            index: index,
            content: index + 1,
          };
          pages[index] = page;
        }
      } else {
        const halfPageRange = Math.floor(this.pageRange / 2);

        // Xét vị trí và idx của trang
        let setPageItem = (index) => {
          let page = {
            index: index,
            content: index + 1,
          };

          pages[index] = page;
        };

        // Xet khoảng ngắt "..."
        let setBreakView = (index) => {
          let breakView = {
            breakView: true,
          };
          pages[index] = breakView;
        };

        // 1st - Xét các trang bên trái khoảng ngắt
        for (let i = 0; i < this.marginPages; i++) {
          setPageItem(i);
        }

        // 2nd - Xét các trang cần hiện thị
        let selectedRangeLow = 0;
        if (this.currentPage - halfPageRange > 0) {
          selectedRangeLow = this.currentPage - 1 - halfPageRange;
        }

        let selectedRangeHigh = selectedRangeLow + this.pageRange - 1;
        if (selectedRangeHigh >= this.totalPage) {
          selectedRangeHigh = this.totalPage - 1;
          selectedRangeLow = selectedRangeHigh - this.pageRange + 1;
        }

        for (
          let i = selectedRangeLow;
          i <= selectedRangeHigh && i <= this.totalPage - 1;
          i++
        ) {
          setPageItem(i);
        }

        // Kiểm tra nếu có ngắt "..." ở bên trái khoảng
        if (selectedRangeLow > this.marginPages) {
          setBreakView(selectedRangeLow - 1);
        }

        // Kiểm tra nếu có ngắt "..." ở bên phải khoảng
        if (selectedRangeHigh + 1 < this.totalPage - this.marginPages) {
          setBreakView(selectedRangeHigh + 1);
        }
        // 3rd - Xét các trang bên phải khoảng ngắt
        for (
          let i = this.totalPage - 1;
          i >= this.totalPage - this.marginPages;
          i--
        ) {
          setPageItem(i);
        }
      }
      return pages;
    },
  },
};
</script>

<template>
  <div class="m-pagination">
    <span
      class="m-pagination-prev"
      :class="{ disable: mCurrentPage === 1 }"
      @click="onMovePage(-1)"
      >Trước</span
    >
    <div class="m-pagination-bar">
      <template v-for="page in pagesToShow" :key="page">
        <span v-if="page.breakView" style="margin: 0 6px">...</span>
        <button
          v-else
          class="m-pagination-item"
          :class="{
            'm-pagination-item--active': mCurrentPage === page.content,
          }"
          @click="onPageChange(page?.content)"
        >
          {{ page?.content }}
        </button>
      </template>
    </div>
    <span
      class="m-pagination-next"
      :class="{ disable: mCurrentPage === totalPage }"
      @click="onMovePage(1)"
      >Sau</span
    >
  </div>
</template>

<style scoped>
@import url(@/css/components/pagination.css);
</style>
