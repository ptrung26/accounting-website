import publicAPI from "@/config/api";

const apiController = "/Payments";

const caPayementService = {
  /**
   * Lấy danh sách hóa đơn
   * Author: ptrung26 (06/11/2023)
   *
   */
  async filter(params) {
    params.orderDirection = "DESC";
    const res = await publicAPI.get(`${apiController}/Filter`, { params });
    return res.data;
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
   * Lấy mã phiếu chi mới
   * @returns res
   */
  async getNewCode() {
    const res = await publicAPI.get(`${apiController}/newcode`);
    return res;
  },

  /**
   * Xử lý thêm phiếu chi mới
   * Author: ptrung26 (12/11/2023)
   * @param {Object} payment Phiếu chi
   * @param {Array} paymentDetails Chi tiết phiếu chi
   */
  async post(payment, paymentDetails) {
    const data = {
      payment,
      paymentDetails,
    };
    const res = await publicAPI.post(
      `${apiController}/create_master_detail`,
      data
    );

    return res;
  },

  /**
   * Xử lý thêm phiếu chi mới
   * Author: ptrung26 (13/11/2023)
   * @param {Object} payment Phiếu chi
   * @param {Array} paymentDetails Chi tiết phiếu chi
   */
  async put(payment, paymentDetails) {
    const data = {
      payment,
      paymentDetails,
    };
    const res = await publicAPI.put(
      `${apiController}/update_master_detail`,
      data
    );

    return res;
  },

  /**
   * Xử lý xóa nhiều
   * Author: ptrung26 (08/11/2023)
   * @param {Array} receiveList
   * @returns
   */
  async deleteMul(receiveList) {
    const res = await publicAPI.delete(`${apiController}/delete_mul`, {
      data: receiveList,
    });
    return res;
  },

  /**
   * Xử lý gọi API xuất dữ liệu phiếu chi ra excel
   * Author: ptrung26 (01/10/2023)
   * @returns response
   */
  async exportPayments(keyword) {
    let params = {};
    params.keyword = keyword;
    const res = await publicAPI.get(`${apiController}/export`, {
      params,
      responseType: "blob",
    });
    return res;
  },
};

export default caPayementService;
