const MISAResource = {
  VI: {
    FormTitle: {
      Account: {
        Edit: "Sửa tài khoản",
        Add: "Thêm tài khoản",
        Replication: "Nhân bản tài khoản",
      },
    },

    TableAction: {
      View: "Xem",
      Edit: "Sửa",
      Delete: "Xóa",
    },

    // Gender
    GenderName: {
      Male: "Nam",
      Female: "Nữ",
      Other: "Khác",
    },

    // Tiêu đề
    Headers: {
      Info: "Thông báo",
      Warning: "Cảnh báo",
      Success: "Thành công",
      Error: "Lỗi",
      ConfirmDelete: "Xác nhận xóa",
    },

    Title: {
      Error: "Thông tin lỗi",
      DeleteError: "Xoá không thành công",
    },

    // Thông báo khi thành công
    SuccessMessage: {
      AddEmployee: "Thêm nhân viên mới thành công",
      EditEmployee: "Chỉnh sửa nhân viên thành công",
      DeleteEmployee: "Xóa nhân viên thành công",

      CaUser: {
        DeleteAccount: "Xóa tài khoản thành công",
        AddAccount: "Thêm tài khoản mới thành công",
        EditAccount: "Chỉnh sửa tài khoản thành công",
      },

      Payment: {
        DeleteMul: "Xóa các phiếu chi thành công",
        Update: "Chỉnh sửa phiếu thành công",
        Add: "Thêm phiếu chi thành công",
      },
    },

    // Thông báo khi lỗi
    ErrorMessage: {
      EmployeeIdNotFound: "Mã không được bỏ trống",
      EmployeeCodeIsExist: "Mã nhân viên đã tồn tại",
      EmployeeNameNotFound: "Tên không được bỏ trống",
      DepartmentNotFound: "Đơn vị không được bỏ trống",
      DateOfBirthIsEmpty: "Ngày sinh không được để trống",
      DateOfBirthIsGreaterThanCurrentDate:
        "Ngày sinh không được lớn hơn ngày hiện tại",
      IdentityDateIsEmpty: "Ngày tạo căn cước không được để trống",
      IdentityDateIsGreaterThanCurrentDate:
        "Ngày tạo căn cước không được hơn ngày hiện tại",
      IdentityDateIsSmallerThanDateOfBirth:
        "Ngày tạo căn cước phải lớn hơn ngày sinh",
      ServerError:
        "Không thể cập nhật dữ liệu. Vui lòng kiểm tra lại internet.",
      ErrorFullNameLength: "Tên không được quá 100 kí tự",
      EmailInvalid: "Email nhập không đúng định dạng",

      AccountDetail: {
        AccountNumberNotFound: "Số tài khoản không được bỏ trống",
        LengthOfAccountNumberIsInvalid: "Số tài khoản không được nhỏ hơn 3",
        AccountNameNotFound: "Tên tài khoản không được bỏ trống",
        AccountNumberIsNotBeginWithGeneralAccount:
          "Số tài khoản chi tiết phải bắt đầu bằng số của Tài khoản tổng hợp",
        ErrorDeleteBecauseItIsParent:
          "Xóa không thành công. Không thể xóa danh mục cha nếu chưa xóa danh mục con",
        AccountIsExist: (accountNumber) =>
          `Số tài khoản ${accountNumber} đã tồn tại, vui lòng kiểm tra lại`,
        AccountGeneralIsNotFound:
          "Danh mục <Tài khoản tổng hợp> không có trong danh mục",
        DebitAccoutNotFound:
          "Tài khoản nợ chưa có trong danh mục tài khoản ngầm định",
        CreateAccountNotFound: "Tài khoản có không được để trống",
        PropertyNotFound: "Tính chất không được để trống",
        PropertyIsNotExist: "Dữ liệu <Tính chất> không có trong danh mục",
      },

      PaymentDetail: {
        RefnoFinanceNotFound: "Số phiếu chi không được để trống",
        RefnoFinanceIsExist: (refid) => `Số phiếu chi ${refid} đã tồn tại`,
        RefDateIsGreaterThanPostedDate:
          "Ngày chứng từ không được phép lớn hơn ngày hạch toán",
        DebitAccountIsEmpty: "Tài khoản nợ không được để trống",
        CreditAccountIsEmpty: "Tài khoản có không được để trống",
        PaymentCodeIsExist: (code) => `Số chứng từ <${code}> đã tồn tại.`,
        SuppliderCodeIsNotExist:
          "Dữ liệu <Mã đối tượng> không có trong danh mục",
        EmployeeCodeIsNotExist:
          "Dữ liệu <Mã nhân viên> không có trong danh mục",
        RefnoFinanceMustLastByNumber: "Số phiếu chi phải kết thúc là chữ số",
      },
    },

    // Các thông tin khi mở dialog
    Dialog: {
      ConfirmDeleteMessage(employeeCode) {
        return `Bạn chắc chắn muốn xóa nhân viên <${employeeCode}> không ?`;
      },
      CaUser: {
        ConfirmDeleteAccount(account) {
          return `Bạn chắc chắn muốn xóa tài khoản <${account}> không ?`;
        },
        SetAllChildrenActive: `Bạn có muốn thiết lập trạng thái "Sử dụng" cho tất cả <Tài khoản> con không?`,
        CantSetActiveBecauseParentIsInActive: `Tài khoản cha đang ở trạng thái "Ngừng sử dụng". Bạn không thể thiết lập trạng thái "Sử dụng" cho tài khoản con`,
      },
      ConfirmDeleteMulMessage:
        "Bạn chắc chắn muốn xóa các nhân viên này không ?",
      SaveDataBeforeCloseForm: "Dữ liệu đã bị thay đổi, bạn có muốn cất không?",
      backButton: "Hủy",
      cancelButton: "Không",
      CAUser: {
        InActiveAllChildren:
          "Bạn có muốn ngừng sử dụng tất cả tài khoản con không",
      },
      CAPayment: {
        ConfirmDeleteMulPayment:
          "Bạn có chắc chắn muốn xóa những chứng từ này không?",
        ConfirmDeleteAllPaymentDetailRow:
          "Bạn có thực sự muốn xóa tất cả các dòng đã nhập không?",
        ConfirmDeletePayment: "Bạn có chắc chắn muốn xóa chứng từ này không?",
      },
    },

    // combobox mặc định
    comboboxLabel: {
      placeholder: "Lựa chọn phần tử",
    },

    // Số bản ghi mỗi trang
    paginationLabel: {
      TenRecords: "10 bản ghi trên 1 trang",
      TwentyRecords: "20 bản ghi trên 1 trang",
      ThirtyRecords: "30 bản ghi trên 1 trang",
      FiftyRecords: "50 bản ghi trên 1 trang",
      OneHundredRecords: "100 bản ghi trên 1 trang",
    },

    // combobox phòng ban
    postionLabel: {
      placeholder: "Lựa chọn phòng ban",
    },

    // combobox tài khoản tổng hợp
    generalAcoountLabel: {
      placeholder: "Tài khoản tổng hợp",
    },

    // combobox tính chất
    propertyLabel: {
      placeholder: "Tính chất",
    },

    // Định dạng ngày tháng
    dateTypeLabel: {
      dd__mm__yyyy: "Định dạng: DD/MM/YYYY",
      yyyy__mm__dd: "Định dạng: YYYY/MM/DD",
      mm__dd__yyyy: "Định dạng: MM/DD/YYYY",
    },

    // Tính chất
    PropertyLabel: {
      First: "Dư có",
      Second: "Dư nợ",
      Third: "Lưỡng tính",
      Fourth: "Không có số dư",
    },

    // Trạng thái tài khoản
    ActiveLabel: {
      active: "Đang sử dụng",
      inactive: "Ngừng sử dụng",
    },

    // Đối tượng
    ObjectLabel: {
      Customer: "Khách hàng",
      Supplier: "Nhà cung cấp",
      Employee: "Nhân viên",
    },

    // DetailAction
    DetailByAction: {
      OnlyWarning: "Chỉ cảnh báo",
      MustInput: "Bắt buộc nhập",
    },

    // Trạng thái ngừng sử dụng
    ActiveMenu: {
      inactive: "Ngừng sử dụng",
      active: "Sử dụng",
    },

    // Ca navigate
    CaNav: {
      Process: "Quy trình",
      CollectAndSpendMoney: "Thu, chi tiền",
    },
  },

  EN: {},
};

export default MISAResource;
