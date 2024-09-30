export const enumData = {
  /** User Types */
  UserType: {
    Employee: { code: "Employee", name: "Employee", description: "", value: "" },
    Admin: { code: "Admin", name: "Admin", description: "", value: "" },
    Author: { code: "Author", name: "Author", description: "", value: "" },
    User: { code: "User", name: "User", description: "", value: "" },
    Student: { code: "Student", name: "Student", description: "", value: "" },
  },
  /** Login Types */
  LoginType: {
    Local: { code: "Local", name: "Login with username and password", description: "", value: "local" },
    Google: { code: "Google", name: "Login with Google", description: "", value: "google" },
  },
  /** Payment Periods */
  PaymentPeriods: {
    MONTH: { code: "MONTH", name: "Monthly Payment" },
    YEAR: { code: "YEAR", name: "Yearly Payment" },
  },
  /** Payment Status */
  PaymentStatus: {
    UNPAID: { code: "UNPAID", name: "Unpaid", color: "gray" },
    PAID: { code: "PAID", name: "Paid", color: "blue" },
  },
  /** Payment Types */
  PaymentType: {
    TRANSFER: { code: "TRANSFER", name: "Bank Transfer" },
    CASH: { code: "CASH", name: "Cash" },
  },
  Gender: {
    MALE: { code: "MALE", name: "Male" },
    FEMALE: { code: "FEMALE", name: "Female" },
    OTHER: { code: "OTHER", name: "Other" },
  },
  /** Working Modes */
  WorkingMode: {
    FULL_TIME: { code: "FULL_TIME", name: "Full-Time", name1: "Fulltime", color: "#40B34F" },
    PART_TIME: { code: "PART_TIME", name: "Part-Time", name1: "Partime", color: "#EAB042" },
  },
  /** Employee Status */
  EmployeeStatus: {
    PENDING: { code: "PENDING", name: "Pending Approval", color: "#e8af4f" },
    WORKING: { code: "WORKING", name: "Working", color: "#0b5a23" },
    STOP_WORKING: { code: "STOP_WORKING", name: "Stopped Working", color: "#f13060" },
  },
  EmailStatus: {
    Success: {
      code: "Success",
      name: "Email Sent Successfully",
      description: "",
    },
    Fail: {
      code: "Fail",
      name: "Email Sending Failed",
      description: "",
    },
  },
  SQSMessageType: {
    Test: "test",
    Email: "email",
    SupplierBid: "supplier_bid",
    SupplierRegister: "supplier_register",
  },
  EmailTemplate: {
    InviteToInterview: {
      code: "GuiNccNguoiDuyetDuyetDangKy",
      name: "Green Leaf System - Account Information Notification",
      description: "3/ Email template for suppliers when approver approves and account information",
      numOfVariable: 3,
      default: `<p>Dear Customer {0},</p>
        <br>
        <p>Welcome to the Green Leaf System.</p>
        <p>Your login information is as follows:</p>
        <p>- Username: {1}</p>
        <p>- Password: {2}</p>
        <p>Please change your password and save your account information for future use.</p>
        <br>
        <p>Best regards,</p>
        <p>Green Leaf System</p>
        <br>
        <p><i>Note: This email is sent automatically from the Green Leaf System. Please do not reply.</i></p>`,
    },
  },
  DataType: {
    string: { code: "string", name: "String Type", format: "" },
    int: { code: "int", name: "Integer Type", format: "" },
    float: { code: "float", name: "Float Type", format: "" },
    date: { code: "date", name: "Date Type", format: "dd/MM/yyyy" },
    dateTime: { code: "dateTime", name: "Date-Time Type", format: "dd/MM/yyyy HH:mm:ss" },
    time: { code: "time", name: "Time Type", format: "HH:mm:ss" },
    boolean: { code: "boolean", name: "Checkbox Type", format: "" },
  },
  DayInWeek: {
    SUNDAY: { code: "0", name: "Sunday" },
    MONDAY: { code: "1", name: "Monday" },
    TUESDAY: { code: "2", name: "Tuesday" },
    WEDNESDAY: { code: "3", name: "Wednesday" },
    THURSDAY: { code: "4", name: "Thursday" },
    FRIDAY: { code: "5", name: "Friday" },
    SATURDAY: { code: "6", name: "Saturday" },
  },
  /** Notification Status */
  NotifyStatus: {
    Read: { name: "Read", code: "Read" },
    New: { name: "Unread", code: "New" },
  },
  /** Notification Types */
  NotifyType: {
    MOBILE_APP: { name: "Mobile", code: "MOBILE_APP" },
    WEB: { name: "Web", code: "WEB" },
  },
  Permission: {
    code: "Permission",
    name: "Permission",
    View: { name: "View", code: "Permission_View", value: false },
    Add: { name: "Add New", code: "Permission_Add", value: false },
    Edit: { name: "Edit", code: "Permission_Edit", value: false },
    Delete: { name: "Delete", code: "Permission_Delete", value: false },
  },
  /** System Role Group Permissions for the Website */
  RoleGroup: {
    // 1. Course
    Course: {
      id: 1,
      name: "Course",
      code: "Course",
      children: [
        {
          code: "Course",
          name: "Course List",
          View: { name: "View", code: "Course_View", value: false },
          Create: { name: "Add New", code: "Course_Create", value: false },
          Detail: { name: "View Details", code: "Course_Detail", value: false },
          Edit: { name: "Edit", code: "Course_Edit", value: false },
          Delete: { name: "Delete", code: "Course_Delete", value: false },
        },
        {
          code: "CourseCategory",
          name: "Course Category List",
          View: { name: "View", code: "CourseCategory_View", value: false },
          Create: { name: "Add New", code: "CourseCategory_Create", value: false },
          Detail: { name: "View Details", code: "CourseCategory_Detail", value: false },
          Edit: { name: "Edit", code: "CourseCategory_Edit", value: false },
          Delete: { name: "Delete", code: "CourseCategory_Delete", value: false },
        },
        // Other course-related fields...
      ],
    },
    // 2. Orders
    Order: {
      id: 2,
      name: "Order",
      code: "Order",
      children: [
        {
          code: "Order",
          name: "Order List",
          View: { name: "View", code: "Order_View", value: false },
          Create: { name: "Add New", code: "Order_Create", value: false },
          Detail: { name: "View Details", code: "Order_Detail", value: false },
          Edit: { name: "Edit", code: "Order_Edit", value: false },
          Delete: { name: "Delete", code: "Order_Delete", value: false },
        },
        // Other order-related fields...
      ],
    },
    // 3. Người dùng
    User: {
      id: 3,
      name: "Người dùng",
      code: "User",
      children: [
        {
          code: "User",
          name: "Danh sách người dùng",
          View: { name: "Xem", code: "User_View", value: false },
          Create: { name: "Thêm mới", code: "Order_Create", value: false },
          Detail: { name: "Xem chi tiết", code: "User_Detail", value: false },
          Edit: { name: "Chỉnh Sửa", code: "User_Edit", value: false },
          Delete: { name: "Xóa", code: "User_Delete", value: false },
        },
        {
          code: "Permission",
          name: "Phân quyền",
          View: { name: "Xem", code: "Permission_View", value: false },
          Create: { name: "Thêm mới", code: "Permission_Create", value: false },
          Detail: { name: "Xem chi tiết", code: "Permission_Detail", value: false },
          Edit: { name: "Chỉnh Sửa", code: "Permission_Edit", value: false },
          Delete: { name: "Xóa", code: "Permission_Delete", value: false },
        },
      ],
    },

    // 4. Báo cáo
    ReportCenter: {
      id: 4,
      name: "Báo cáo",
      code: "Report",
      children: [
        {
          code: "UserProgress",
          name: "Báo cáo chi tiết người dùng",
          View: { name: "Xem", code: "UserProgress_View", value: false },
          Create: { name: "Thêm mới", code: "UserProgress_Create", value: false },
          Detail: { name: "Xem chi tiết", code: "UserProgress_Detail", value: false },
          Edit: { name: "Chỉnh Sửa", code: "UserProgress_Edit", value: false },
          Delete: { name: "Xóa", code: "UserProgress_Delete", value: false },
        },
        {
          code: "CourseInsight",
          name: "Báo cáo chi tiết khoá học",
          View: { name: "Xem", code: "CourseInsight_View", value: false },
          Create: { name: "Thêm mới", code: "CourseInsight_Create", value: false },
          Detail: { name: "Xem chi tiết", code: "CourseInsight_Detail", value: false },
          Edit: { name: "Chỉnh Sửa", code: "CourseInsight_Edit", value: false },
          Delete: { name: "Xóa", code: "CourseInsight_Delete", value: false },
        },
      ],
    },

    // 5. Marketing
    Marketing: {
      id: 5,
      name: "Marketing",
      code: "Marketing",
      children: [
        {
          code: "CouponType",
          name: "Loại coupon",
          View: { name: "Xem", code: "CouponType_View", value: false },
          Create: { name: "Thêm mới", code: "CouponType_Create", value: false },
          Detail: { name: "Xem chi tiết", code: "CouponType_Detail", value: false },
          Edit: { name: "Chỉnh Sửa", code: "CouponType_Edit", value: false },
          Delete: { name: "Xóa", code: "CouponType_Delete", value: false },
        },
        {
          code: "VoucherBundle",
          name: "Gói giảm giá",
          View: { name: "Xem", code: "VoucherBundle_View", value: false },
          Create: { name: "Thêm mới", code: "VoucherBundle_Create", value: false },
          Detail: { name: "Xem chi tiết", code: "VoucherBundle_Detail", value: false },
          Edit: { name: "Chỉnh Sửa", code: "VoucherBundle_Edit", value: false },
          Delete: { name: "Xóa", code: "VoucherBundle_Delete", value: false },
        },
        {
          code: "Subscription",
          name: "Đăng ký hàng tháng/ năm",
          View: { name: "Xem", code: "Subscription_View", value: false },
          Create: { name: "Thêm mới", code: "Subscription_Create", value: false },
          Detail: { name: "Xem chi tiết", code: "Subscription_Detail", value: false },
          Edit: { name: "Chỉnh Sửa", code: "Subscription_Edit", value: false },
          Delete: { name: "Xóa", code: "Subscription_Delete", value: false },
        },
        {
          code: "Coupon",
          name: "Danh sách coupon",
          View: { name: "Xem", code: "Coupon_View", value: false },
          Create: { name: "Thêm mới", code: "Coupon_Create", value: false },
          Detail: { name: "Xem chi tiết", code: "Coupon_Detail", value: false },
          Edit: { name: "Chỉnh Sửa", code: "Coupon_Edit", value: false },
          Delete: { name: "Xóa", code: "Coupon_Delete", value: false },
        },
      ],
    },
    // 6. Blog
    Blog: {
      id: 6,
      name: "Blog",
      code: "Blog",
      children: [
        {
          code: "Blog",
          name: "Danh sách bài viết",
          View: { name: "Xem", code: "Blog_View", value: false },
          Create: { name: "Thêm mới", code: "Blog_Create", value: false },
          Detail: { name: "Xem chi tiết", code: "Blog_Detail", value: false },
          Edit: { name: "Chỉnh Sửa", code: "Blog_Edit", value: false },
          Delete: { name: "Xóa", code: "Blog_Delete", value: false },
        },
        {
          code: "BlogCategory",
          name: "Danh sách loại bài viết",
          View: { name: "Xem", code: "BlogCategory_View", value: false },
          Create: { name: "Thêm mới", code: "BlogCategory_Create", value: false },
          Detail: { name: "Xem chi tiết", code: "BlogCategory_Detail", value: false },
          Edit: { name: "Chỉnh Sửa", code: "BlogCategory_Edit", value: false },
          Delete: { name: "Xóa", code: "BlogCategory_Delete", value: false },
        },
        {
          code: "BlogComment",
          name: "Bình luận bài viết",
          View: { name: "Xem", code: "BlogComment_View", value: false },
          Create: { name: "Thêm mới", code: "BlogComment_Create", value: false },
          Detail: { name: "Xem chi tiết", code: "BlogComment_Detail", value: false },
          Edit: { name: "Chỉnh Sửa", code: "BlogComment_Edit", value: false },
          Delete: { name: "Xóa", code: "BlogComment_Delete", value: false },
        },
      ],
    },
    // 7. Feedback
    Feedback: {
      id: 7,
      name: "Feedback",
      code: "Feedback",
      children: [
        {
          code: "Feedback",
          name: "Phản hồi feedback",
          View: { name: "Xem", code: "Feedback_View", value: false },
          Create: { name: "Thêm mới", code: "Feedback_Create", value: false },
          Detail: { name: "Xem chi tiết", code: "Feedback_Detail", value: false },
          Edit: { name: "Chỉnh Sửa", code: "Feedback_Edit", value: false },
          Delete: { name: "Xóa", code: "Feedback_Delete", value: false },
        },
      ],
    },
    // 8. Feedback
    Setting: {
      id: 8,
      name: "Setting",
      code: "Setting",
      children: [
        {
          code: "Setting",
          name: "Cài đặt Setting",
          View: { name: "Xem", code: "Setting_View", value: false },
          Create: { name: "Thêm mới", code: "Setting_Create", value: false },
          Detail: { name: "Xem chi tiết", code: "Setting_Detail", value: false },
          Edit: { name: "Chỉnh Sửa", code: "Setting_Edit", value: false },
          Delete: { name: "Xóa", code: "Setting_Delete", value: false },
        },
      ],
    },
  },

  ActiveStatus: {
    ACTIVE: { code: "ACTIVE", name: "Đang hoạt động", value: false },
    INACTIVE: { code: "INACTIVE", name: "Ngưng hoạt động", value: true },
    ALL: { code: "ACTIVE", name: "Tất cả", value: null },
  },

  ActionLogType: {
    ThemMoi: { code: "ThemMoi", name: "Thêm mới", value: false },
    CapNhat: { code: "CapNhat", name: "Cập nhật", value: false },
    KichHoat: { code: "KichHoat", name: "Kích hoạt", value: false },
    HuyKichHoat: { code: "HuyKichHoat", name: "Hủy kích hoạt", value: false },
    ThoiViec: { code: "ThoiViec", name: "Thôi việc", value: false },
    Duyet: { code: "Duyet", name: "Duyệt", value: false },
    Huy: { code: "Huy", name: "Hủy", value: false },
    XacNhan: { code: "XacNhan", name: "Xác nhận", value: false },
    TuChoi: { code: "TuChoi", name: "Từ chối", value: false },
    KhongChinhXac: { code: "KhongChinhXac", name: "Không chính xác", value: false },
    ThaoTac: { code: "ThaoTac", name: "Thao tác", value: false },
  },

  ActionLogEnType: {
    Create: { code: "Create", name: "Created", value: false },
    Update: { code: "Update", name: "Updated", value: false },
    Activate: { code: "Activate", name: "Activated", value: false },
    Deactivate: { code: "Deactivate", name: "Deactivated", value: false },
    Fire: { code: "Fire", name: "Fired", value: false },
    Accept: { code: "Accept", name: "Accepted", value: false },
    Destroy: { code: "Destroy", name: "Destroyed", value: false },
    Confirm: { code: "Confirm", name: "Confirmed", value: false },
    Reject: { code: "Reject", name: "Rejected", value: false },
  },

  ManagerRole: {
    Manager: { code: "Manager", name: "Quản lý" },
    Director: { code: "Director", name: "Giám đốc" },
    Leader: { code: "Leader", name: "Leader" },
  },

  SettingString: {
    REVENUE_RATING_AUTHOR: {
      code: 'REVENUE_RATING_AUTHOR',
      name: "Rating for author revenue per order!",
      value: 0.4,
      type: "number"
    }
  },

  /** Trạng thái bài test */
  TestStatus: {
    NEW: { code: "NEW", name: "Mới tạo", color: "#EAB113" },
    DESTROYED: { code: "DESTROYED", name: "Đã huỷ", color: "#ff1a1a" },
    INVALID: { code: "INVALID", name: "Chưa đến hiệu lực", color: "#EAB042" },
    VALID: { code: "VALID", name: "Đang hiệu lực", color: "#005C20" },
    EXPIRE: { code: "EXPIRE", name: "Hết hạn", color: "#F5365C" },
  },

  /** Trạng thái bài test cho từng thằng nhân viên */
  TestUserStatus: {
    NOTTEST: { code: "NOTTEST", name: "Chưa thực hiện", color: "#EAB113" },
    PASS: { code: "PASS", name: "Đạt", color: "#ff1a1a" },
    NOTPASS: { code: "NOTPASS", name: "Chưa đạt", color: "#EAB042" },
  },

  /** Thao tác với bài test */
  TestAction: {
    ACCEPT: { code: "ACCEPT", name: "Duyệt" },
    DESTROY: { code: "DESTROY", name: "Huỷ" },
  },

  /** Các cấp độ của khoá học */
  CourseLevel: {
    ALL: { code: "ALL", name: "All Level", value: "" },
    BEGINNER: { code: "BEGINNER", name: "Beginner", value: "" },
    INTERMEDIATE: { code: "INTERMEDIATE", name: "Intermediate", value: "" },
    ADVANCED: { code: "ADVANCED", name: "Advanced", value: "" },
  },

  /** Trạng thái của người dùng */
  UserStatus: {
    NEW: { code: "NEW", name: "New", color: "#348aed" },
    ACTIVE: { code: "ACTIVE", name: "Active", color: "#5af542" },
    INACTIVE: { code: "INACTIVE", name: "In Active", color: "#ed4734" },
  },
};
