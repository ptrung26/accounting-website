import publicAPI from "@/config/api";

// api kế toán
const apiController = "/Accounts";

const caUserService = {
  /**
   * API lấy danh sách kế toán theo lọc
   * Author: ptrung26 (18/10/2023)
   * @param {object} params thông tin truy vấn
   * @returns response
   */
  async filter(params) {
    const res = await publicAPI.get(`${apiController}`, { params });
    return res;
  },

  /**
   * Lấy thông tin account theo id
   * Author: ptrung26 (22/10/2023)
   * @param {String} id Id của account
   * @returns response
   */
  async getById(id) {
    const res = await publicAPI.get(`${apiController}/${id}`);
    return res;
  },

  /**
   * Thêm kế toán mới
   * Author: ptrung26 18/10/2023
   * @param {object} caUser thông tin kế toán
   * @return response
   */
  async post(caUser) {
    const res = await publicAPI.post(`${apiController}`, caUser);
    return res;
  },

  /**
   * API sửa thông tin kế toán theo id
   * Author: ptrung26 18/10/2023
   * @param {object} caUser thông tin kế toán
   * @return response
   */
  async put(id, caUser) {
    const res = await publicAPI.put(`${apiController}/${id}`, caUser);
    return res;
  },

  /**
   * API xóa kế toán theo id
   * Author: ptrung26 (02/09/2023)
   * @param {string} caUserId Id của kế toán
   * @return response
   */
  async delete(caUserId) {
    const res = await publicAPI.delete(`${apiController}/${caUserId}`);
    return res;
  },

  /**
   * API xóa nhiều kế toán
   * Author: ptrung26 (18/10/2023)
   * @param {Array} caUserIds Danh sách các caUser id cần xóa
   * @returns response
   */
  async mulDelete(caUserIds) {
    const res = await publicAPI.delete(`${apiController}`, {
      data: caUserIds,
    });
    return res;
  },

  /**
   * API tạo mã kế toán mới
   * Author: ptrung26 (24/09/2023)
   * @returns response
   */
  async generateNewcaUserCode() {
    const res = await publicAPI.get(`${apiController}/NewcaUserCode`);
    return res;
  },
};

export default caUserService;
