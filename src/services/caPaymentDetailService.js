import publicAPI from "@/config/api";

const apiController = "/PaymentDetails";

const caPaymentDetailService = {
  /**
   * Lấy danh sách hóa đơn
   * Author: ptrung26 (06/11/2023)
   *
   */
  async filter() {
    const res = await publicAPI.get(`${apiController}`);
    return res;
  },
  /**
   * Lấy thông tin payment
   * Author: ptrung26 (29/10/2023)
   * @param {String} id id của payment
   */
  async getById(id) {
    const res = await publicAPI.get(`${apiController}/${id}`);
    return res;
  },

  /**
   * Lấy tất cả payment detail theo id của payment master
   * Author: ptrung26 (06/11/2023)
   * @param {*} id Id của payment master
   * @returns response
   */
  async getByPaymentId(id) {
    const res = await publicAPI.get(`${apiController}/get_paging_detail`, {
      params: {
        refId: id,
      },
    });

    return res;
  },

  /**
   * Xử lý sửa phiếu chi
   * Author: ptrung26 (08/11/2023)
   * @param {Object} payment Thông tin phiếu chi
   * @param {Array} paymentDetails Thông tin các chi tiết phiếu chi
   * @returns response
   */
  async put(payment, paymentDetails) {
    const res = await publicAPI.put(`${apiController}`, {
      payment,
      paymentDetails,
    });

    return res;
  },
};

export default caPaymentDetailService;
