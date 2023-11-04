import { Server, Model, Factory, RestSerializer, Response } from "miragejs";

export function makeServer({ environment = "development" } = {}) {
  let server = new Server({
    environment,

    // Model
    models: {
      account: Model,
      payment: Model,
      paymentDetail: Model,
    },

    factories: {
      account: Factory.extend({
        accountId: "50b157da-ab79-4b3d-8547-b6dbde8007e6",
        accountCategoryKind: 0,
        accountObjectType: 0,
        detailByJobKind: 0,
        detailByProjectWorkKind: 0,
        detailByOrderKind: 0,
        detailBuyBuyContractKind: 0,
        detailByExpenseItemKind: 0,
        detailByDepartmentKind: 0,
        detailByListItemKind: 0,
        detailByContractKind: 0,
        isPostableInForeignCurrency: false,
        detailByAccountObject: false,
        detailByBankAccount: false,
        detailByJob: false,
        detailByProjectWork: false,
        detailByContract: false,
        detailByOrder: false,
        detailBuyBuyContract: false,
        detailByExpenseItem: false,
        detailByDepartment: false,
        detailByListTtem: false,
        inActive: false,
        accountNumber: "111",
        accountName: "Tiền mặt",
        accountNameEnglish: "Cash in hand",
        reftype_category: 0,
        excel_row_index: 0,
        is_valid: false,
        search_status: 0,
        isParent: true,
        grade: 1,
        misaCodeId: "/00001/",
        created_date: "2023-10-18T13:57:00.3773772+07:00",
        modified_date: "2023-10-18T13:57:00.3773772+07:00",
        auto_refno: false,
        pass_edit_version: false,
        state: 0,
      }),
      payment: Factory.extend({
        refid: "d5c748b3-7781-48a3-877f-e9cce0d4d513",
        account_object_id: "c3ecf352-0523-47b2-991d-c55c2ef43bbc",
        branch_id: "fc731db5-c78c-4f30-bb62-a5f2470e067a",
        employee_id: "a460056e-e801-442c-ace9-1c8065da88f0",
        reason_type_id: 23,
        display_on_book: 0,
        reforder: 1698250094184,
        refdate: "2023-10-01T00:00:00.000+07:00",
        posted_date: "2023-10-06T00:00:00.000+07:00",
        is_posted_finance: true,
        is_posted_management: false,
        is_posted_cash_book_finance: false,
        is_posted_cash_book_management: false,
        is_import_vat: false,
        is_special_vat: false,
        is_environment_vat: false,
        is_vat: false,
        is_settlement: false,
        exchange_rate: 1,
        total_amount_oc: 1010000,
        total_amount: 1010000,
        refno_finance: "888",
        account_object_name: "Quang Anh",
        account_object_address: "ha noi",
        account_object_contact_name: "Quang Anh",
        employee_code: "NV00006",
        account_object_code: "NV00008",
        journal_memo: "Chi tiền cho Quang Anh",
        currency_id: "VND",
        employee_name: "Hà Vân",
        ca_audit_refid: "00000000-0000-0000-0000-000000000000",
        is_group_invoice: false,
        excel_row_index: 0,
        is_valid: false,
        reftype: 1020,
        created_date: "2023-10-25T16:08:14.2452458+07:00",
        created_by: "Hà Vân",
        modified_date: "2023-10-25T16:08:36.6556555+07:00",
        modified_by: "Hà Vân ",
        auto_refno: false,
        edit_version: 145110701,
        pass_edit_version: false,
        state: 0,
      }),
      paymentDetail: Factory.extend({
        refid: "d5c748b3-7781-48a3-877f-e9cce0d4d513",
        ref_detail_id: "da1b7190-ce8a-4257-aa36-4d0c573fc342",
        account_object_id: "c3ecf352-0523-47b2-991d-c55c2ef43bbc",
        sort_order: 1,
        un_resonable_cost: false,
        amount_oc: 1000000,
        amount: 1000000,
        cash_out_amount_finance: 0,
        cash_out_diff_amount_finance: 0,
        cash_out_amount_management: 0,
        cash_out_diff_amount_management: 0,
        cash_out_exchange_rate_finance: 0,
        cash_out_exchange_rate_management: 0,
        description: "Chi tiền cho 1",
        debit_account: "1112",
        credit_account: "1111",
        account_object_code: "NV00008",
        contract_code: "",
        order_code: "",
        pu_contract_code: "",
        account_object_name: "Quang Anh",
        purchase_purpose_id: "ed4bd91d-83ac-4a26-b4c1-4bce85faecb8",
        vat_amount: 0,
        vat_amount_oc: 0,
        vat_rate: 0,
        vat_description: "Thuế GTGT - Chi tiền cho 1",
        purchase_purpose_code: "1",
        pu_order_code: "",
        is_have_invoice: false,
        cash_out_vat_amount_management: 0,
        cash_out_diff_vat_amount_management: 0,
        cash_out_vat_amount_finance: 0,
        cash_out_diff_vat_amount_finance: 0,
        edit_version: 145110656,
        turn_over_amount: 0,
        is_delete_payment_term_reference: false,
        is_update_payment_term_reference: false,
        is_calculated_cost_order: false,
        is_calculated_cost_contract: false,
        pass_edit_version: false,
        state: 0,
      }),
    },

    seeds(server) {
      server.create("account");
      server.create("account", {
        misaCodeId: "/00001/00001/",
        accountId: "1ac41676-f5ae-428b-9944-7a6d42cfbccb",
        accountCategoryKind: 0,
        accountObjectType: 0,
        detailByJobKind: 0,
        detailByProjectWorkKind: 0,
        detailByOrderKind: 0,
        detailBuyBuyContractKind: 0,
        detailByExpenseItemKind: 0,
        detailByDepartmentKind: 0,
        detailByListItemKind: 0,
        detailByContractKind: 0,
        isPostableInForeignCurrency: true,
        detailByAccountObject: false,
        detailByBankAccount: false,
        detailByJob: false,
        detailByProjectWork: false,
        detailByContract: false,
        detailByOrder: false,
        detailBuyBuyContract: false,
        detailByExpenseItem: false,
        detailByDepartment: false,
        detailByListTtem: false,
        inActive: false,
        accountNumber: "1111",
        accountName: "Tiền Việt Nam",
        accountNameEnglish: "Vietnam dong",
        reftype_category: 0,
        excel_row_index: 0,
        is_valid: false,
        search_status: 0,
        isParent: false,
        parent_id: "50b157da-ab79-4b3d-8547-b6dbde8007e6",
        grade: 2,
        created_date: "2023-10-22T21:06:26.1531531+07:00",
        modified_date: "2023-10-21T18:48:53.0970973+07:00",
        modified_by: "Hà Vân",
        auto_refno: false,
        edit_version: 144237152,
        pass_edit_version: false,
        state: 0,
      });
      server.create("account", {
        misaCodeId: "/00001/00002/",
        accountId: "40da9697-4ecb-41c8-8a2b-e51473d7ccf8",
        accountCategoryKind: 0,
        accountObjectType: 0,
        detailByJobKind: 0,
        detailByProjectWorkKind: 0,
        detailByOrderKind: 0,
        detailBuyBuyContractKind: 0,
        detailByExpenseItemKind: 0,
        detailByDepartmentKind: 0,
        detailByListItemKind: 0,
        detailByContractKind: 0,
        isPostableInForeignCurrency: true,
        detailByAccountObject: false,
        detailByBankAccount: false,
        detailByJob: false,
        detailByProjectWork: false,
        detailByContract: false,
        detailByOrder: false,
        detailBuyBuyContract: false,
        detailByExpenseItem: false,
        detailByDepartment: false,
        detailByListTtem: false,
        inActive: false,
        accountNumber: "1112",
        accountName: "Ngoại tệ",
        accountName_english: "Foreign currency",
        reftype_category: 0,
        excel_row_index: 0,
        is_valid: false,
        search_status: 0,
        isParent: false,
        parent_id: "50b157da-ab79-4b3d-8547-b6dbde8007e6",
        grade: 2,
        created_date: "2023-10-22T21:06:26.1531532+07:00",
        modified_date: "2023-10-21T01:49:31.852852+07:00",
        auto_refno: false,
        edit_version: 143997793,
        pass_edit_version: false,
        state: 0,
      });
      server.create("account", {
        misaCodeId: "/00001/00003/",
        accountId: "951b1538-8a31-4f14-883f-e6e43d08eec3",
        accountCategoryKind: 0,
        accountObjectType: 0,
        detailByJobKind: 0,
        detailByProjectWorkKind: 0,
        detailByOrderKind: 0,
        detailBuyBuyContractKind: 0,
        detailByExpenseItemKind: 0,
        detailByDepartmentKind: 0,
        detailByListItemKind: 0,
        detailByContractKind: 0,
        isPostableInForeignCurrency: false,
        detailByAccountObject: false,
        detailByBankAccount: false,
        detailByJob: false,
        detailByProjectWork: false,
        detailByContract: false,
        detailByOrder: false,
        detailBuyBuyContract: false,
        detailByExpenseItem: false,
        detailByDepartment: false,
        detailByListTtem: false,
        inActive: false,
        accountNumber: "1113",
        accountName: "Vàng tiền tệ",
        accountName_english: "Monetary gold",
        reftype_category: 0,
        excel_row_index: 0,
        is_valid: false,
        search_status: 0,
        isParent: false,
        parent_id: "50b157da-ab79-4b3d-8547-b6dbde8007e6",
        grade: 2,
        created_date: "2023-10-22T21:06:26.1531533+07:00",
        modified_date: "2023-10-21T01:49:31.852852+07:00",
        auto_refno: false,
        edit_version: 143997793,
        pass_edit_version: false,
        state: 0,
      });
      server.create("account", {
        misaCodeId: "/00002/",
        accountId: "7cb47db4-2913-491c-b2ce-0c3f47e1aa9a",
        accountCategoryKind: 0,
        accountObjectType: 0,
        detailByJobKind: 0,
        detailByProjectWorkKind: 0,
        detailByOrderKind: 0,
        detailBuyBuyContractKind: 0,
        detailByExpenseItemKind: 0,
        detailByDepartmentKind: 0,
        detailByListItemKind: 0,
        detailByContractKind: 0,
        isPostableInForeignCurrency: false,
        detailByAccountObject: false,
        detailByBankAccount: true,
        detailByJob: false,
        detailByProjectWork: false,
        detailByContract: false,
        detailByOrder: false,
        detailBuyBuyContract: false,
        detailByExpenseItem: false,
        detailByDepartment: false,
        detailByListTtem: false,
        inActive: false,
        accountNumber: "112",
        accountName: "Tiền gửi Ngân hàng",
        accountName_english: "Cash in bank",
        description: "",
        reftype_category: 0,
        excel_row_index: 0,
        is_valid: false,
        search_status: 0,
        isParent: true,
        grade: 1,
        created_date: "2023-10-22T21:06:26.1531533+07:00",
        modified_date: "2012-02-23T00:00:00.000+07:00",
        modified_by: "Admin",
        auto_refno: false,
        edit_version: 142920221,
        pass_edit_version: false,
        state: 0,
      });
      server.create("account", {
        misaCodeId: "/00002/00001/",
        accountId: "0c650a91-0d66-4a95-bfdd-861008523997",
        accountCategoryKind: 0,
        accountObjectType: 0,
        detailByJobKind: 0,
        detailByProjectWorkKind: 0,
        detailByOrderKind: 0,
        detailBuyBuyContractKind: 0,
        detailByExpenseItemKind: 0,
        detailByDepartmentKind: 0,
        detailByListItemKind: 0,
        detailByContractKind: 0,
        isPostableInForeignCurrency: false,
        detailByAccountObject: false,
        detailByBankAccount: true,
        detailByJob: false,
        detailByProjectWork: false,
        detailByContract: false,
        detailByOrder: false,
        detailBuyBuyContract: false,
        detailByExpenseItem: false,
        detailByDepartment: false,
        detailByListTtem: false,
        inActive: false,
        accountNumber: "1121",
        accountName: "Tiền Việt Nam",
        accountName_english: "Vietnam dong",
        description: "",
        reftype_category: 0,
        excel_row_index: 0,
        is_valid: false,
        search_status: 0,
        isParent: false,
        parent_id: "7cb47db4-2913-491c-b2ce-0c3f47e1aa9a",
        grade: 2,
        created_date: "2023-10-22T21:06:26.1531534+07:00",
        modified_date: "2012-02-23T00:00:00.000+07:00",
        modified_by: "Admin",
        auto_refno: false,
        edit_version: 142920221,
        pass_edit_version: false,
        state: 0,
      });
      server.create("account", {
        misaCodeId: "/00002/00002/",
        accountId: "52b1181c-f4eb-451a-88e2-4e631ecf3e16",
        accountCategoryKind: 0,
        accountObjectType: 0,
        detailByJobKind: 0,
        detailByProjectWorkKind: 0,
        detailByOrderKind: 0,
        detailBuyBuyContractKind: 0,
        detailByExpenseItemKind: 0,
        detailByDepartmentKind: 0,
        detailByListItemKind: 0,
        detailByContractKind: 0,
        isPostableInForeignCurrency: true,
        detailByAccountObject: false,
        detailByBankAccount: true,
        detailByJob: false,
        detailByProjectWork: false,
        detailByContract: false,
        detailByOrder: false,
        detailBuyBuyContract: false,
        detailByExpenseItem: false,
        detailByDepartment: false,
        detailByListTtem: false,
        inActive: false,
        accountNumber: "1122",
        accountName: "Ngoại tệ",
        accountName_english: "Foreign currency",
        description: "",
        reftype_category: 0,
        excel_row_index: 0,
        is_valid: false,
        search_status: 0,
        isParent: false,
        parent_id: "7cb47db4-2913-491c-b2ce-0c3f47e1aa9a",
        grade: 2,
        created_date: "2023-10-22T21:06:26.1531535+07:00",
        modified_date: "2012-02-23T00:00:00.000+07:00",
        modified_by: "Admin",
        auto_refno: false,
        edit_version: 142920221,
        pass_edit_version: false,
        state: 0,
      });
      server.create("payment");
      server.create("paymentDetail");
      server.create("paymentDetail", {
        refid: "d5c748b3-7781-48a3-877f-e9cce0d4d513",
        ref_detail_id: "2f98f93f-ee90-4847-84e2-555751c910e7",
        account_object_id: "c3ecf352-0523-47b2-991d-c55c2ef43bbc",
        sort_order: 2,
        un_resonable_cost: false,
        amount_oc: 10000,
        amount: 10000,
        cash_out_amount_finance: 0,
        cash_out_diff_amount_finance: 0,
        cash_out_amount_management: 0,
        cash_out_diff_amount_management: 0,
        cash_out_exchange_rate_finance: 0,
        cash_out_exchange_rate_management: 0,
        description: "Chi tiền cho 2",
        debit_account: "1111",
        credit_account: "1111",
        account_object_code: "NV00008",
        contract_code: "",
        order_code: "",
        pu_contract_code: "",
        account_object_name: "Quang Anh",
        purchase_purpose_id: "ed4bd91d-83ac-4a26-b4c1-4bce85faecb8",
        vat_amount: 0,
        vat_amount_oc: 0,
        vat_rate: 0,
        vat_description: "Thuế GTGT - Chi tiền cho 2",
        purchase_purpose_code: "1",
        pu_order_code: "",
        is_have_invoice: false,
        cash_out_vat_amount_management: 0,
        cash_out_diff_vat_amount_management: 0,
        cash_out_vat_amount_finance: 0,
        cash_out_diff_vat_amount_finance: 0,
        edit_version: 145110656,
        turn_over_amount: 0,
        is_delete_payment_term_reference: false,
        is_update_payment_term_reference: false,
        is_calculated_cost_order: false,
        is_calculated_cost_contract: false,
        pass_edit_version: false,
        state: 0,
      });
    },

    serializers: {
      application: RestSerializer,
    },

    // Routes
    routes() {
      this.urlPrefix = "https://localhost:44346";
      this.namespace = "api/v1";

      // GET all accounts
      this.get("di/accounts", function (schema) {
        const accounts = schema.accounts.all();
        const raw = this.serialize(accounts);
        const data = raw.accounts.map((item) => item);
        return data;
      });

      // GET account by ID
      this.get("di/accounts/:id", function (schema, request) {
        const id = request.params.id;
        const account = schema.accounts.findBy({ accountId: id });
        if (account) {
          const data = this.serialize(account);
          return data.account;
        } else {
          return new Response(404, { errors: "Account not found" });
        }
      });

      // POST a new account
      this.post("di/accounts", function (schema, request) {
        const attrs = JSON.parse(request.requestBody);
        const data = schema.accounts.findBy({
          accountNumber: attrs.accountNumber,
        });
        const account = this.serialize(data);
        if (account) {
          return new Response(409, { errors: ["Account is exist"] });
        }
      });

      // UPDATE an existing account
      this.patch("di/accounts/:id", function (schema, request) {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        const account = schema.accounts.find(id);
        return account.update(attrs);
      });

      // delete account
      this.del("di/accounts/:id", function (schema, request) {
        const accountId = request.params.accountId;
        const account = schema.accounts.findBy({ accountId: accountId });

        if (account) {
          account.destroy();
          return new Response(204, { success: true, code: 1 });
        } else {
          return new Response(404, {
            success: false,
            code: 2,
            error: "Account not found",
          });
        }
      });

      // get payment by id
      this.get("/payment_detail/:id", function (schema, request) {
        const id = request.params.id;
        const payment = schema.payments.findBy({ refid: id });
        const paymentDetail = schema.paymentDetails.where({ refid: id });
        if (payment) {
          const data = {
            ...this.serialize(payment),
            ...this.serialize(paymentDetail),
          };
          return data;
        } else {
          return new Response(400, { errors: "payment not found" });
        }
      });
    },
  });

  return server;
}
