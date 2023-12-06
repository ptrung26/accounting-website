import publicAPI from "@/config/api";

// api kế toán
const apiController = "/Accounts";

const caAccountService = {
  /**
   * Lấy toàn bộ tài khoản
   * Author: ptrung26 (18/10/2023)
   * @returns res
   */
  async getAll() {
    const res = await publicAPI.get(`${apiController}`);
    return res.data;
  },

  /**
   * API lấy danh sách kế toán theo lọc
   * Author: ptrung26 (18/10/2023)
   * @param {object} params thông tin truy vấn
   * @returns response
   */
  async filter(params) {
    let obj = { ...params };
    if (params?.columns) {
      const columns = params.columns;
      obj.columns = btoa(JSON.stringify(columns));
    }
    obj.orderByColumn = "AccountNumber";
    obj.orderDirection = "ASC";
    const res = await publicAPI.get(`${apiController}/Filter`, {
      params: obj,
    });
    return res.data;
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
   * Cập nhật trạng thái nhiều tài khoản
   * Author: ptrung26 (04/11/2023)
   * @param {Array} ids Danh sách id của các tài khoản cần cập nhật
   * @param {boolean} inActive Trạng thái cập nhật
   */
  async updateMulState(ids, inActive) {
    const res = await publicAPI.put(
      `${apiController}/di_update_inactive`,
      ids,
      {
        params: {
          inActive,
        },
      }
    );
    return res;
  },
};

export default caAccountService;
