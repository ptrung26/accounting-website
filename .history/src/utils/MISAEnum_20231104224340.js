import MISAResource from "./MISAResource";

const MISAEnum = {
  // Kiểu form
  FormType: {
    Add: 0,
    Edit: 1,
    Replication: 2,
    View: 3,
  },

  // Http status
  HttpStatus: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
  },

  // Trạng thái của toast
  ToastStatus: {
    Info: 0,
    Success: 1,
    Warning: 2,
    Error: 3,
  },

  // Trạng thái của dialg
  DialogStatus: {
    Info: 0,
    Action: 1,
  },

  // Giới tính
  Gender: {
    Male: 0,
    Female: 1,
    Other: 2,
  },

  // Các trạng thái sau khi thêm
  AddStatus: {
    AddAndSave: 0,
    Add: 1,
  },

  // Date type
  DateType: {
    dd__mm__yyyy: 0,
    yyyy__mm__dd: 1,
    mm__dd__yyyy: 2,
  },

  // DataType
  DataType: {
    Text: 1,
    Number: 0,
    Date: 2,
  },

  // ColumnType
  ColumnType: {
    View: 0,
    Input: 1,
    Combobox: 2,
  },

  // Tính chất
  Property: {
    First: 0,
    Second: 1,
    Third: 2,
    Fourth: 3,
    PropText: "propertyName",
    PropValue: "property",
    get(val) {
      switch (val) {
        case this.First:
          return MISAResource.VI.PropertyLabel.First;
        case this.Second:
          return MISAResource.VI.PropertyLabel.Second;
        case this.Third:
          return MISAResource.VI.PropertyLabel.Third;
        case this.Fourth:
          return MISAResource.VI.PropertyLabel.Fourth;
        default:
          return "";
      }
    },
  },

  // General Account
  GeneralAccount: {
    PropText: "accountNumber",
    PropValue: "accountNumber",
  },

  // Trạng thái
  ActiveState: {
    InActive: false,
    Active: true,
    get(val) {
      switch (val) {
        case this.InActive:
          return MISAResource.VI.ActiveLabel.active;
        case this.Active:
          return MISAResource.VI.ActiveLabel.inact;
        default:
          return "";
      }
    },
  },

  // Đối tượng
  ObjectValue: {
    Customer: 0,
    Supplier: 1,
    Employee: 2,
    get(val) {
      switch (val) {
        case this.Customer:
          return MISAResource.VI.ObjectLabel.Customer;
        case this.Supplier:
          return MISAResource.VI.ObjectLabel.Supplier;
        case this.Employee:
          return MISAResource.VI.ObjectLabel.Employee;
        default:
          return MISAResource.VI.ObjectLabel.Customer;
      }
    },
  },

  // Chi tiết hành động
  DetailByAction: {
    OnlyWarning: 0,
    MustInput: 1,
    get(val) {
      switch (val) {
        case this.OnlyWarning:
          return MISAResource.VI.DetailByAction.OnlyWarning;
        case this.MustInput:
          return MISAResource.VI.DetailByAction.MustInput;
        default:
          return MISAResource.VI.DetailByAction.OnlyWarning;
      }
    },
  },

  // Định dạng text
  ColumnTextStyle: {
    Left: 0,
    Center: 1,
    Right: 2,
  },
};

export default MISAEnum;
