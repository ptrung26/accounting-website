import publicAPI from "@/config/api";

const apiController = "/payment_detail";

const caPayementService = {
  /**
   * Lấy thông tin payment
   * Author: ptrung26 (29/10/2023)
   * @param {String} id id của payment
   */
  async getById(id) {
    const res = await publicAPI.get(`${apiController}/${id}`);
    return res;
  },
};

export default caPayementService;
