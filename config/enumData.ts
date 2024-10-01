export const enumData = {
  UserType: {
    Employee: { code: "Employee", name: "Employee", description: "", value: "" },
    Admin: { code: "Admin", name: "Admin", description: "", value: "" },
    Author: { code: "Author", name: "Author", description: "", value: "" },
    User: { code: "User", name: "User", description: "", value: "" },
    Student: { code: "Student", name: "Student", description: "", value: "" },
  },
  UserStatus: {
    NEW: { code: "NEW", name: "New", color: "#348aed" },
    ACTIVE: { code: "ACTIVE", name: "Active", color: "#5af542" },
    INACTIVE: { code: "INACTIVE", name: "In Active", color: "#ed4734" },
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
    // 3. User
    User: {
      id: 3,
      name: "User",
      code: "User",
      children: [
        {
          code: "User",
          name: "User list",
          View: { name: "View", code: "User_View", value: false },
          Create: { name: "Add new", code: "User_Create", value: false },
          Detail: { name: "View details", code: "User_Detail", value: false },
          Edit: { name: "Edit", code: "User_Edit", value: false },
          Delete: { name: "Erase", code: "User_Delete", value: false },
        },
        {
          code: "Permission",
          name: "Permission",
          View: { name: "View", code: "Permission_View", value: false },
          Create: { name: "Add new", code: "Permission_Create", value: false },
          Detail: { name: "View details", code: "Permission_Detail", value: false },
          Edit: { name: "Edit", code: "Permission_Edit", value: false },
          Delete: { name: "Erase", code: "Permission_Delete", value: false },
        },
      ],
    },

    // 4. Report
    ReportCenter: {
      id: 4,
      name: "Report",
      code: "Report",
      children: [
        {
          code: "UserProgress",
          name: "Detailed User Report",
          View: { name: "View", code: "UserProgress_View", value: false },
          Create: { name: "Add new", code: "UserProgress_Create", value: false },
          Detail: { name: "View details", code: "UserProgress_Detail", value: false },
          Edit: { name: "Edit", code: "UserProgress_Edit", value: false },
          Delete: { name: "Erase", code: "UserProgress_Delete", value: false },
        },
        {
          code: "CourseInsight",
          name: "Detailed Course Report",
          View: { name: "View", code: "CourseInsight_View", value: false },
          Create: { name: "Add new", code: "CourseInsight_Create", value: false },
          Detail: { name: "View details", code: "CourseInsight_Detail", value: false },
          Edit: { name: "Edit", code: "CourseInsight_Edit", value: false },
          Delete: { name: "Erase", code: "CourseInsight_Delete", value: false },
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
          name: "Coupon type",
          View: { name: "View", code: "CouponType_View", value: false },
          Create: { name: "Add new", code: "CouponType_Create", value: false },
          Detail: { name: "View details", code: "CouponType_Detail", value: false },
          Edit: { name: "Edit", code: "CouponType_Edit", value: false },
          Delete: { name: "Erase", code: "CouponType_Delete", value: false },
        },
        {
          code: "VoucherBundle",
          name: "Discount package",
          View: { name: "View", code: "VoucherBundle_View", value: false },
          Create: { name: "Add new", code: "VoucherBundle_Create", value: false },
          Detail: { name: "View details", code: "VoucherBundle_Detail", value: false },
          Edit: { name: "Edit", code: "VoucherBundle_Edit", value: false },
          Delete: { name: "Erase", code: "VoucherBundle_Delete", value: false },
        },
        {
          code: "Subscription",
          name: "Monthly registration/ year",
          View: { name: "View", code: "Subscription_View", value: false },
          Create: { name: "Add new", code: "Subscription_Create", value: false },
          Detail: { name: "View details", code: "Subscription_Detail", value: false },
          Edit: { name: "Edit", code: "Subscription_Edit", value: false },
          Delete: { name: "Erase", code: "Subscription_Delete", value: false },
        },
        {
          code: "Coupon",
          name: "Coupon list",
          View: { name: "View", code: "Coupon_View", value: false },
          Create: { name: "Add new", code: "Coupon_Create", value: false },
          Detail: { name: "View details", code: "Coupon_Detail", value: false },
          Edit: { name: "Edit", code: "Coupon_Edit", value: false },
          Delete: { name: "Erase", code: "Coupon_Delete", value: false },
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
          name: "List of articles",
          View: { name: "View", code: "Blog_View", value: false },
          Create: { name: "Add new", code: "Blog_Create", value: false },
          Detail: { name: "View details", code: "Blog_Detail", value: false },
          Edit: { name: "Edit", code: "Blog_Edit", value: false },
          Delete: { name: "Erase", code: "Blog_Delete", value: false },
        },
        {
          code: "BlogCategory",
          name: "List of articles",
          View: { name: "View", code: "BlogCategory_View", value: false },
          Create: { name: "Add new", code: "BlogCategory_Create", value: false },
          Detail: { name: "View details", code: "BlogCategory_Detail", value: false },
          Edit: { name: "Edit", code: "BlogCategory_Edit", value: false },
          Delete: { name: "Erase", code: "BlogCategory_Delete", value: false },
        },
        {
          code: "BlogComment",
          name: "Commentary article",
          View: { name: "View", code: "BlogComment_View", value: false },
          Create: { name: "Add new", code: "BlogComment_Create", value: false },
          Detail: { name: "View details", code: "BlogComment_Detail", value: false },
          Edit: { name: "Edit", code: "BlogComment_Edit", value: false },
          Delete: { name: "Erase", code: "BlogComment_Delete", value: false },
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
          name: "Feedback",
          View: { name: "View", code: "Feedback_View", value: false },
          Create: { name: "Add new", code: "Feedback_Create", value: false },
          Detail: { name: "View details", code: "Feedback_Detail", value: false },
          Edit: { name: "Edit", code: "Feedback_Edit", value: false },
          Delete: { name: "Erase", code: "Feedback_Delete", value: false },
        },
      ],
    },
    // 8. Setting
    Setting: {
      id: 8,
      name: "Setting",
      code: "Setting",
      children: [
        {
          code: "Setting",
          name: "Setting",
          View: { name: "View", code: "Setting_View", value: false },
          Create: { name: "Add new", code: "Setting_Create", value: false },
          Detail: { name: "View details", code: "Setting_Detail", value: false },
          Edit: { name: "Edit", code: "Setting_Edit", value: false },
          Delete: { name: "Erase", code: "Setting_Delete", value: false },
        },
      ],
    },
  },
  LoginType: {
    Local: { code: "Local", name: "Login with username and password", description: "", value: "local" },
    Google: { code: "Google", name: "Login with Google", description: "", value: "google" },
  },
  TestStatus: {
    NEW: { code: "NEW", name: "New", color: "#EAB113" },
    DESTROYED: { code: "DESTROYED", name: "Destroyed", color: "#ff1a1a" },
    INVALID: { code: "INVALID", name: "Invalid", color: "#EAB042" },
    VALID: { code: "VALID", name: "Valid", color: "#005C20" },
    EXPIRE: { code: "EXPIRE", name: "Expired", color: "#F5365C" },
  },
  SettingString: {
    REVENUE_RATING_AUTHOR: {
      code: 'REVENUE_RATING_AUTHOR',
      name: "Rating for author revenue per order!",
      value: 0.4,
      type: "number"
    }
  },
};
