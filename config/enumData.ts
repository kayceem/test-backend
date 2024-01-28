export const enumData = {
    /** Loại user */
    UserType: {
      Employee: { code: 'Employee', name: 'Nhân viên', description: '' },
      Admin: { code: 'Admin', name: 'Admin', description: '' },
    },

    /** Loại kỳ thanh toán */
    PaymentPeriods: {
      MONTH: { code: 'MONTH', name: 'Thanh toán theo tháng' },
      YEAR: { code: 'YEAR', name: 'Thanh toán theo năm' },
    },

    /** Trạng thái thanh toán */
    PaymentStatus: {
      UNPAID: { code: 'UNPAID', name: 'Chưa thanh toán', color: 'gray' },
      PAID: { code: 'PAID', name: 'Đã thanh toán', color: 'blue' },
    },
    /** Loại thanh toán */
    PaymentType: {
      TRANSFER: { code: 'TRANSFER', name: 'Chuyển khoản' },
      CASH: { code: 'CASH', name: 'Tiền mặt' },
    },

    Gender: {
      MALE: { code: 'MALE', name: 'Nam' },
      FEMALE: { code: 'FEMALE', name: 'Nữ' },
      OTHER: { code: 'OTHER', name: 'Khác' },
    },
    /** Chế độ làm việc  */
    WorkingMode: {
      FULL_TIME: { code: 'FULL_TIME', name: 'Toàn thời gian', name1: 'Fulltime', color: '#40B34F' },
      PART_TIME: { code: 'PART_TIME', name: 'Bán thời gian', name1: 'Partime', color: '#EAB042' },
    },
  
    /** Trạng thái nhân viên*/
    EmployeeStatus: {
      PENDING: { code: 'PENDING', name: 'Chờ duyệt', color: '#e8af4f' },
      WORKING: { code: 'WORKING', name: 'Đang làm việc', color: '#0b5a23' },
      STOP_WORKING: { code: 'STOP_WORKING', name: 'Thôi việc', color: '#f13060' },
    },
  
    EmailStatus: {
      Success: {
        code: 'Success',
        name: 'Gửi email thành công',
        description: '',
      },
      Fail: {
        code: 'Fail',
        name: 'Gửi email thất bại',
        description: '',
      },
    },
  
    SQSMessageType: {
      Test: 'test',
      Email: 'email',
      SupplierBid: 'supplier_bid',
      SupplierRegister: 'supplier_register',
    },
  
    EmailTemplate: {
      InviteToInterview: {
        code: 'GuiNccNguoiDuyetDuyetDangKy',
        name: 'Hệ Thống Green Leaf - Thông báo thông tin tài khoản quý khách',
        description: '3/ Mẫu email gửi NCC khi người duyệt đã duyệt và thông tin tài khoản',
        numOfVariable: 3,
        default: `<p>Kính gửi Quý khách {0},</p>
        <br>
        <p>Chào mừng Quý khách đến với Hệ Thống Green Leaf.</p>
        <p>Thông tin đăng nhập của Quý khách như sau:</p>
        <p>- Tên Đăng Nhập: {1}</p>
        <p>- Mật khẩu: {2}</p>
        <p>Quý khách vui lòng đổi mật khẩu và lưu thông tin tài khoản trên để sử dụng cho việc đăng nhập.</p>
        <br>
        <p>Trân trọng,</p>
        <p>Hệ Thống Green Leaf</p>
        <br>
        <p><i>Lưu ý: Mail này được gửi tự động từ Hệ Thống Green Leaf, vui lòng không Reply.</i></p>`,
      },
    },
  
    DataType: {
      string: { code: 'string', name: 'Kiểu chuỗi', format: '' },
      int: { code: 'int', name: 'Kiểu sổ nguyên', format: '' },
      float: { code: 'float', name: 'Kiểu sổ thập phân', format: '' },
      date: { code: 'date', name: 'Kiểu ngày', format: 'dd/MM/yyyy' },
      dateTime: { code: 'dateTime', name: 'Kiểu ngày giờ', format: 'dd/MM/yyyy HH:mm:ss' },
      time: { code: 'time', name: 'Kiểu giờ', format: 'HH:mm:ss' },
      boolean: { code: 'boolean', name: 'Kiểu checkbox', format: '' },
    },
  
    DayInWeek: {
      SUNDAY: { code: '0', name: 'Chủ nhật' },
      MONDAY: { code: '1', name: 'Thứ hai' },
      TUESDAY: { code: '2', name: 'Thứ ba' },
      WEDNESDAY: { code: '3', name: 'Thứ tư' },
      THURSDAR: { code: '4', name: 'Thứ năm' },
      FRIDAY: { code: '5', name: 'Thứ sáu' },
      SATURDAY: { code: '6', name: 'Thứ bảy' },
    },
    
    /**Trạng thái notify */
    NotifyStatus: {
      Read: { name: 'Đã đọc', code: 'Read' },
      New: { name: 'Chưa đọc', code: 'New' },
    },
  
    /** Loại thông báo notify */
    NotifyType: {
      MOBILE_APP: { name: 'Mobile', code: 'MOBILE_APP' },
      WEB: { name: 'Web', code: 'WEB' },
    },
  
    Permission: {
      code: 'Permission',
      name: 'Phân Quyền',
      View: { name: 'Xem', code: 'Permission_View', value: false },
      Add: { name: 'Tạo Mới', code: 'Permission_Add', value: false },
      Edit: { name: 'Chỉnh Sửa', code: 'Permission_Edit', value: false },
      Delete: { name: 'Xóa', code: 'Permission_Delete', value: false },
    },

    /** Phân quyền hệ thống Role group cho website*/
    RoleGroup: {
      // 1. Báo cáo
      Report: {
        id: 1,
        name: 'Báo cáo',
        code: 'Report',
        children: [
          {
            code: 'Report',
            name: 'Báo cáo chấm công',
            View: { name: 'Xem', code: 'Report_View', value: false },
          },
          {
            code: 'ReportSalary',
            name: 'Báo cáo bảng lương',
            View: { name: 'Xem', code: 'ReportSalary_View', value: false },
          },
          {
            code: 'ReportHR',
            name: 'Báo cáo nhân sự',
            View: { name: 'Xem', code: 'ReportHR_View', value: false },
          },
          {
            code: 'ReportWork',
            name: 'Báo cáo công việc',
            View: { name: 'Xem', code: 'ReportWork_View', value: false },
          },
        ]
      },
  
      // 2. Module tuyển dụng
      Hiring: {
        id: 2,
        name: 'Tuyển dụng',
        code: 'Hiring',
        children: [
          // Tiêu chí đánh giá
          {
            code: 'EvaluationCriteria',
            name: 'Tiêu chí đánh giá',
            Add: { name: 'Tạo Mới', code: 'EvaluationCriteria_Add', value: false },
            View: { name: 'Xem', code: 'EvaluationCriteria_View', value: false },
            Detail: { name: 'Xem chi tiết', code: 'EvaluationCriteria_Detail', value: false },
            Edit: { name: 'Chỉnh Sửa', code: 'EvaluationCriteria_Edit', value: false },
            Delete: { name: 'Xóa', code: 'EvaluationCriteria_Delete', value: false },
            History: { name: 'Lịch sử thao tác', code: 'EvaluationCriteria_History', value: false },
          },
          // Nguồn tuyển
          {
            code: 'HiringSource',
            name: 'Nguồn tuyển',
            Add: { name: 'Tạo Mới', code: 'HiringSource_Add', value: false },
            View: { name: 'Xem', code: 'HiringSource_View', value: false },
            Detail: { name: 'Xem chi tiết', code: 'HiringSource_Detail', value: false },
            Edit: { name: 'Chỉnh Sửa', code: 'HiringSource_Edit', value: false },
            Delete: { name: 'Xóa', code: 'HiringSource_Delete', value: false },
            History: { name: 'Lịch sử thao tác', code: 'HiringSource_History', value: false },
          },
          // Kế hoạch tuyển dụng
          {
            code: 'HiringPlan',
            name: 'Kế hoạch tuyển dụng',
            Add: { name: 'Tạo Mới', code: 'HiringPlan_Add', value: false },
            View: { name: 'Xem', code: 'HiringPlan_View', value: false },
            Detail: { name: 'Xem chi tiết', code: 'HiringPlan_Detail', value: false },
            Edit: { name: 'Chỉnh Sửa', code: 'HiringPlan_Edit', value: false },
            Delete: { name: 'Xóa', code: 'HiringPlan_Delete', value: false },
            Accept: { name: 'Duyệt', code: 'HiringPlan_Accept', value: false },
            History: { name: 'Lịch sử thao tác', code: 'HiringPlan_History', value: false },
          },
          // Ứng viên
          {
            code: 'Candidate',
            name: ' Ứng viên',
            Add: { name: 'Tạo Mới', code: 'Candidate_Add', value: false },
            View: { name: 'Xem', code: 'Candidate_View', value: false },
            Detail: { name: 'Xem chi tiết', code: 'Candidate_Detail', value: false },
            Edit: { name: 'Chỉnh Sửa', code: 'Candidate_Edit', value: false },
            Delete: { name: 'Xóa', code: 'Candidate_Delete', value: false },
            Invite: { name: 'Mời phỏng vấn', code: 'Candidate_Invite', value: false },
            Confirm: { name: 'Xác nhận phỏng vấn', code: 'Candidate_Confirm', value: false },
            Destroy: { name: 'Huỷ phỏng vấn', code: 'Candidate_Destroy', value: false },
            Evaluate: { name: 'Đánh giá ứng viên', code: 'Candidate_Evaluate', value: false },
            History: { name: 'Lịch sử thao tác', code: 'Candidate_History', value: false },
          },
          // Phỏng vấn
          {
            code: 'Interview',
            name: 'Phỏng vấn',
            View: { name: 'Xem', code: 'Interview_View', value: false },
          },
        ],
      },
  
      // 3. Module nhân sự
      HumanResource: {
        id: 3,
        name: 'Nhân sự',
        code: 'HumanResource',
        children: [
          // Nhân viên
          {
            code: 'Employee',
            name: 'Nhân Viên',
            Add: { name: 'Tạo Mới', code: 'Employee_Add', value: false },
            View: { name: 'Xem', code: 'Employee_View', value: false },
            Detail: { name: 'Xem chi tiết', code: 'Employee_Detail', value: false },
            Edit: { name: 'Chỉnh Sửa', code: 'Employee_Edit', value: false },
            Accept: { name: 'Duyệt', code: 'Employee_Accept', value: false },
            Contract: { name: 'Cấu hình hợp đồng', code: 'Employee_Contract', value: false },
            TimeKeeping: { name: 'Cấu hình công', code: 'Employee_TimeKeeping', value: false },
            TaxInsurance: { name: 'Cấu hình thuế/ bảo hiểm', code: 'Employee_TaxInsurance', value: false },
            Fire: { name: 'Thôi việc nhân viên', code: 'Employee_Fire', value: false },
            DayOff: { name: 'Ngày nghỉ', code: 'Employee_DayOff', value: false },
            History: { name: 'Lịch sử', code: 'Employee_History', value: false },
          },
          // Công ty
          {
            code: 'Company',
            name: 'Công ty',
            Add: { name: 'Tạo Mới', code: 'Company_Add', value: false },
            View: { name: 'Xem', code: 'Company_View', value: false },
            Detail: { name: 'Xem chi tiết', code: 'Company_Detail', value: false },
            Edit: { name: 'Chỉnh Sửa', code: 'Company_Edit', value: false },
            Delete: { name: 'Xóa', code: 'Company_Delete', value: false },
            History: { name: 'Lịch sử thao tác', code: 'Company_History', value: false },
          },
          // Phòng ban (Bộ phận)
          {
            code: 'Department',
            name: 'Phòng Ban',
            Add: { name: 'Tạo Mới', code: 'Department_Add', value: false },
            View: { name: 'Xem', code: 'Department_View', value: false },
            Detail: { name: 'Xem chi tiết', code: 'Department_Detail', value: false },
            Edit: { name: 'Chỉnh Sửa', code: 'Department_Edit', value: false },
            Delete: { name: 'Xóa', code: 'Department_Delete', value: false },
          },
          // Chức vụ
          {
            code: 'Position',
            name: 'Chức vụ',
            Add: { name: 'Tạo Mới', code: 'Position_Add', value: false },
            View: { name: 'Xem', code: 'Position_View', value: false },
            Detail: { name: 'Xem chi tiết', code: 'Position_Detail', value: false },
            Edit: { name: 'Chỉnh Sửa', code: 'Position_Edit', value: false },
            Delete: { name: 'Xóa', code: 'Position_Delete', value: false },
            History: { name: 'Lịch sử thao tác', code: 'Position_History', value: false },
          },
          // Loại hợp đồng
          {
            code: 'ContractType',
            name: 'Loại hợp đồng',
            Add: { name: 'Tạo Mới', code: 'ContractType_Add', value: false },
            View: { name: 'Xem', code: 'ContractType_View', value: false },
            Detail: { name: 'Xem chi tiết', code: 'ContractType_Detail', value: false },
            Edit: { name: 'Chỉnh Sửa', code: 'ContractType_Edit', value: false },
            Delete: { name: 'Xóa', code: 'ContractType_Delete', value: false },
            History: { name: 'Lịch sử thao tác', code: 'ContractType_History', value: false },
          },
          {
            code: 'PermissionWebsiteFunction',
            name: 'Phân quyền Website chức năng',
            View: { name: 'Xem', code: 'PermissionWebsiteFunction_View', value: false },
            Edit: { name: 'Chỉnh sửa', code: 'PermissionWebsiteFunction_Edit', value: false },
          },
          {
            code: 'PermissionWebsiteData',
            name: 'Phân quyền Website dữ liệu',
            View: { name: 'Xem', code: 'PermissionWebsiteData_View', value: false },
            Edit: { name: 'Chỉnh sửa', code: 'PermissionWebsiteData_Edit', value: false },
          },
          {
            code: 'PermissionMobileFunction',
            name: 'Phân quyền Mobile chức năng',
            View: { name: 'Xem', code: 'PermissionMobileFunction_View', value: false },
            Edit: { name: 'Chỉnh sửa', code: 'PermissionMobileFunction_Edit', value: false },
          },
          {
            code: 'PermissionMobileData',
            name: 'Phân quyền Mobile dữ liệu',
            View: { name: 'Xem', code: 'PermissionMobileData_View', value: false },
            Edit: { name: 'Chỉnh sửa', code: 'PermissionMobileData_Edit', value: false },
          },
        ],
      },
  
      // 04. Ngày nghỉ
      DayOff: {
        id: 4,
        name: 'Ngày nghỉ',
        code: 'DayOff',
        children: [
          // Cấu hình ngày nghỉ
          {
            code: 'DayOffConfig',
            name: 'Cấu Hình Ngày nghỉ',
            Add: { name: 'Tạo Mới', code: 'DayOffConfig_Add', value: false },
            View: { name: 'Xem', code: 'DayOffConfig_View', value: false },
            Detail: { name: 'Xem chi tiết', code: 'DayOffConfig_Detail', value: false },
            Edit: { name: 'Chỉnh Sửa', code: 'DayOffConfig_Edit', value: false },
            Delete: { name: 'Xóa', code: 'DayOffConfig_Delete', value: false },
            History: { name: 'Lịch sử thao tác', code: 'DayOffConfig_History', value: false },
          },
          // Danh sách ngày nghỉ
          {
            code: 'DayOff',
            name: 'Danh sách Ngày nghỉ',
            Add: { name: 'Tạo Mới', code: 'DayOff_Add', value: false },
            View: { name: 'Xem', code: 'DayOff_View', value: false },
            Accept: { name: 'Duỵệt', code: 'DayOff_Accept', value: false },
            Detail: { name: 'Xem chi tiết', code: 'DayOff_Detail', value: false },
            Reject: { name: 'Từ chối', code: 'DayOff_Reject', value: false },
            History: { name: 'Lịch sử thao tác', code: 'DayOff_History', value: false },
          },
        ],
      },
  
      // 05. Ca làm việc
      Shift: {
        id: 5,
        name: 'Ca làm việc',
        code: 'Shift',
        children: [
          // Thiết lập ca
          {
            code: 'Shift',
            name: 'Thiết lập ca',
            Add: { name: 'Tạo Mới', code: 'Shift_Add', value: false },
            View: { name: 'Xem', code: 'Shift_View', value: false },
            Detail: { name: 'Xem chi tiết', code: 'Shift_Detail', value: false },
            Edit: { name: 'Chỉnh Sửa', code: 'Shift_Edit', value: false },
            Delete: { name: 'Xóa', code: 'Shift_Delete', value: false },
            History: { name: 'Lịch sử thao tác', code: 'History', value: false },
          },
          // Lịch làm việc
          {
            code: 'WorkScheduled',
            name: 'Lịch làm việc',
            View: { name: 'Xem', code: 'WorkScheduled_View', value: false },
            // Detail: { name: 'Xem chi tiết', code: 'WorkScheduled_Detail', value: false },
            // Accept: { name: 'Xác nhận', code: 'WorkScheduled_Accept', value: false },
            // Reject: { name: 'Từ chối', code: 'WorkScheduled_Reject', value: false },
            // History: { name: 'Lịch sử thao tác', code: 'WorkScheduled_History', value: false },
          },
          // Xếp lịch làm việc
          {
            code: 'WorkScheduledEmployee',
            name: 'Xếp lịch làm việc',
            View: { name: 'Xem', code: 'WorkScheduledEmployee_View', value: false },
            Detail: { name: 'Xem chi tiết', code: 'WorkScheduledEmployee_Detail', value: false },
            Arrange: { name: 'Xếp lịch', code: 'WorkScheduledEmployee_Detail', value: false },
            AcceptAndSend: { name: 'Xác nhận và gửi lịch', code: 'WorkScheduledEmployee_AcceptAndSend', value: false },
            Destroy: { name: 'Huỷ bỏ', code: 'WorkScheduledEmployee_Destroy', value: false },
            History: { name: 'Lịch sử thao tác', code: 'WorkScheduledEmployee_History', value: false },
          },
          // Danh sách đổi ca
          {
            code: 'WorkScheduledChange',
            name: 'Danh sách đổi ca',
            View: { name: 'Xem', code: 'WorkScheduledChange_View', value: false },
            Detail: { name: 'Xem chi tiết', code: 'WorkScheduledChange_Detail', value: false },
            Accept: { name: 'Xác nhận', code: 'WorkScheduledChange_Accept', value: false },
            Reject: { name: 'Từ chối', code: 'WorkScheduledChange_Reject', value: false },
            History: { name: 'Lịch sử thao tác', code: 'WorkScheduledChange_History', value: false },
          },
        ],
      },
  
      // 6. Module chấm công
      TimeKeeping: {
        id: 6,
        name: 'chấm công',
        code: 'TimeKeeping',
        children: [
          // Bảng chấm công
          {
            code: 'TimeKeeping',
            name: 'Bảng chấm công',
            View: { name: 'Xem', code: 'TimeKeeping_View', value: false }
          },
          // Dữ liệu công hằng ngày
          {
            code: 'TimeKeepingDailyData',
            name: 'Dữ liệu công hằng ngày',
            View: { name: 'Xem', code: 'TimeKeepingDailyData_View', value: false },
            Detail: { name: 'Xem chi tiết', code: 'TimeKeepingDailyData_Detail', value: false },
            Edit: { name: 'Chỉnh Sửa', code: 'TimeKeepingDailyData_Edit', value: false },
            Delete: { name: 'Xóa', code: 'TimeKeepingDailyData_Delete', value: false },
            History: { name: 'Lịch sử thao tác', code: 'TimeKeepingDailyData_History', value: false },
          },
          // Tổng hợp bảng công
          {
            code: 'SummarizeTimeKeeping',
            name: 'Tổng hợp bảng công',
            View: { name: 'Xem', code: 'SummarizeTimeKeeping_View', value: false },
            Detail: { name: 'Xem chi tiết', code: 'SummarizeTimeKeeping_Detail', value: false },
            Summarize: { name: 'Tổng hợp', code: 'SummarizeTimeKeeping_Summarize', value: false },
            Send: { name: 'Gửi bảng công', code: 'SummarizeTimeKeeping_Send', value: false },
            History: { name: 'Lịch sử thao tác', code: 'SummarizeTimeKeeping_History', value: false },
            Approve: { name: 'Xác nhận', code: 'SummarizeTimeKeeping_Approve', value: false },
          },
          // Chấm công bổ sung
          {
            code: 'AdditionalTimeKeeping',
            name: 'Chấm công bổ sung',
            Add: { name: 'Tạo Mới', code: 'AdditionalTimeKeeping_Add', value: false },
            View: { name: 'Xem', code: 'AdditionalTimeKeeping_View', value: false },
            Detail: { name: 'Xem chi tiết', code: 'AdditionalTimeKeeping_Detail', value: false },
            Edit: { name: 'Chỉnh Sửa', code: 'AdditionalTimeKeeping_Edit', value: false },
            Accept: { name: 'Duyệt', code: 'AdditionalTimeKeeping_Accept', value: false },
            Destroy: { name: 'Huỷ', code: 'AdditionalTimeKeeping_Destroy', value: false },
            History: { name: 'Lịch sử thao tác', code: 'AdditionalTimeKeeping_History', value: false },
          },
          // Thống kê chấm công
          {
            code: 'TimeKeepingReport',
            name: 'Thống kê chấm công',
            View: { name: 'Xem', code: 'TimeKeepingReport_View', value: false },
          },
        ],
      },
  
      // 7. Module lương
      Salary: {
        id: 7,
        name: 'Lương',
        code: 'Salary',
        children: [
          // Cấu hình hệ số lương
          {
            code: 'SalaryCoefficient',
            name: 'Cấu hình hệ số lương',
            Add: { name: 'Tạo Mới', code: 'SalaryCoefficient_Add', value: false },
            View: { name: 'Xem', code: 'SalaryCoefficient_View', value: false },
            Detail: { name: 'Xem chi tiết', code: 'SalaryCoefficient_Detail', value: false },
            Edit: { name: 'Chỉnh Sửa', code: 'SalaryCoefficient_Edit', value: false },
            Delete: { name: 'Xóa', code: 'SalaryCoefficient_Delete', value: false },
            History: { name: 'Lịch sử thao tác', code: 'SalaryCoefficient_History', value: false },
          },
          // Cấu hình phụ cấp
          {
            code: 'ConfigAllowance',
            name: 'Cấu hình phụ cấp',
            Add: { name: 'Tạo Mới', code: 'ConfigAllowance_Add', value: false },
            View: { name: 'Xem', code: 'ConfigAllowance_View', value: false },
            Detail: { name: 'Xem chi tiết', code: 'ConfigAllowance_Detail', value: false },
            Edit: { name: 'Chỉnh Sửa', code: 'ConfigAllowance_Edit', value: false },
            Delete: { name: 'Xóa', code: 'ConfigAllowance_Delete', value: false },
            History: { name: 'Lịch sử thao tác', code: 'ConfigAllowance_History', value: false },
          },
          // Phụ cấp
          {
            code: 'Allowance',
            name: 'Phụ cấp',
            Add: { name: 'Tạo Mới', code: 'Allowance_Add', value: false },
            View: { name: 'Xem', code: 'Allowance_View', value: false },
            Detail: { name: 'Xem chi tiết', code: 'Allowance_Detail', value: false },
            Edit: { name: 'Chỉnh Sửa', code: 'Allowance_Edit', value: false },
            Delete: { name: 'Xóa', code: 'Allowance_Delete', value: false },
            History: { name: 'Lịch sử thao tác', code: 'Allowance_History', value: false },
          },
          // Phiếu cộng tiền
          {
            code: 'CashAdditionSlip',
            name: 'Phiếu cộng tiền',
            Add: { name: 'Tạo Mới', code: 'CashAdditionSlip_Add', value: false },
            View: { name: 'Xem', code: 'CashAdditionSlip_View', value: false },
            Detail: { name: 'Xem chi tiết', code: 'CashAdditionSlip_Detail', value: false },
            Edit: { name: 'Chỉnh Sửa', code: 'CashAdditionSlip_Edit', value: false },
            Delete: { name: 'Xóa', code: 'CashAdditionSlip_Delete', value: false },
            History: { name: 'Lịch sử thao tác', code: 'CashAdditionSlip_History', value: false },
          },
          // Phiếu trừ tiền
          {
            code: 'DeductionSlip',
            name: 'Phiếu trừ tiền',
            Add: { name: 'Tạo Mới', code: 'DeductionSlip_Add', value: false },
            View: { name: 'Xem', code: 'DeductionSlip_View', value: false },
            Detail: { name: 'Xem chi tiết', code: 'DeductionSlip_Detail', value: false },
            Edit: { name: 'Chỉnh Sửa', code: 'DeductionSlip_Edit', value: false },
            Delete: { name: 'Xóa', code: 'DeductionSlip_Delete', value: false },
            History: { name: 'Lịch sử thao tác', code: 'DeductionSlip_History', value: false },
          },
          // Loại tạm ứng
          {
            code: 'AdvanceType',
            name: 'Loại tạm ứng',
            Add: { name: 'Tạo Mới', code: 'AdvanceType_Add', value: false },
            View: { name: 'Xem', code: 'AdvanceType_View', value: false },
            Detail: { name: 'Xem chi tiết', code: 'AdvanceType_Detail', value: false },
            Edit: { name: 'Chỉnh Sửa', code: 'AdvanceType_Edit', value: false },
            Delete: { name: 'Xóa', code: 'AdvanceType_Delete', value: false },
            History: { name: 'Lịch sử thao tác', code: 'AdvanceType_History', value: false },
          },
          // Tạm ứng
          {
            code: 'Advance',
            name: 'Tạm ứng',
            Add: { name: 'Tạo Mới', code: 'Advance_Add', value: false },
            View: { name: 'Xem', code: 'Advance_View', value: false },
            Detail: { name: 'Xem chi tiết', code: 'Advance_Detail', value: false },
            Edit: { name: 'Chỉnh Sửa', code: 'Advance_Edit', value: false },
            Delete: { name: 'Xóa', code: 'Advance_Delete', value: false },
            History: { name: 'Lịch sử thao tác', code: 'Advance_History', value: false },
          },
          // Bảng lương
          {
            code: 'Salary',
            name: 'Bảng lương',
            View: { name: 'Xem', code: 'Salary_View', value: false },
          },
          // Tổng hợp lương
          {
            code: 'SummarizeSalary',
            name: 'Tổng hợp lương',
            View: { name: 'Xem', code: 'SummarizeSalary_View', value: false },
            Detail: { name: 'Xem chi tiết', code: 'SummarizeSalary_Detail', value: false },
            History: { name: 'Lịch sử thao tác', code: 'SummarizeSalary_History', value: false },
          },
        ],
      },
  
      // 08. Module thu chi
      ReceiptPayslips: {
        id: 8,
        code: 'ReceiptPayslips',
        name: 'Thu chi',
        children: [
          // Loại phiếu thu
          {
            code: 'ReceiptType',
            name: 'Loại phiếu thu',
            Add: { name: 'Tạo Mới', code: 'ReceiptType_Add', value: false },
            View: { name: 'Xem', code: 'ReceiptType_View', value: false },
            Detail: { name: 'Xem chi tiết', code: 'ReceiptType_Detail', value: false },
            Edit: { name: 'Chỉnh Sửa', code: 'ReceiptType_Edit', value: false },
            Delete: { name: 'Xóa', code: 'ReceiptType_Delete', value: false },
            History: { name: 'Lịch sử thao tác', code: 'ReceiptType_History', value: false },
          },
          // Loại Phiếu chi
          {
            code: 'PayslipType',
            name: 'Loại Phiếu chi',
            Add: { name: 'Tạo Mới', code: 'PayslipType_Add', value: false },
            View: { name: 'Xem', code: 'PayslipType_View', value: false },
            Detail: { name: 'Xem chi tiết', code: 'PayslipType_Detail', value: false },
            Edit: { name: 'Chỉnh Sửa', code: 'PayslipType_Edit', value: false },
            Delete: { name: 'Xóa', code: 'PayslipType_Delete', value: false },
            History: { name: 'Lịch sử thao tác', code: 'PayslipType_History', value: false },
          },
          // Phiếu thu
          {
            code: 'Receipt',
            name: 'Quản lý Phiếu Thu',
            Add: { name: 'Tạo Mới', code: 'Receipt_Add', value: false },
            View: { name: 'Xem', code: 'Receipt_View', value: false },
            Detail: { name: 'Xem chi tiết', code: 'Receipt_Detail', value: false },
            Edit: { name: 'Chỉnh Sửa', code: 'Receipt_Edit', value: false },
            Destroy: { name: 'Huỷ phiếu thu', code: 'Receipt_Destroy', value: false },
            Accept: { name: 'Duyệt phiếu thu', code: 'Receipt_Accept', value: false },
            Upload: { name: 'Upload chứng từ', code: 'Receipt_Upload', value: false },
            Delete: { name: 'Xóa', code: 'Receipt_Delete', value: false },
            History: { name: 'Lịch sử thao tác', code: 'Receipt_History', value: false },
          },
          // Phiếu chi
          {
            code: 'Payslip',
            name: 'Quản Lý Phiếu Chi',
            Add: { name: 'Tạo Mới', code: 'Payslip_Add', value: false },
            View: { name: 'Xem', code: 'Payslip_View', value: false },
            Detail: { name: 'Xem chi tiết', code: 'Payslip_Detail', value: false },
            Edit: { name: 'Chỉnh Sửa', code: 'Payslip_Edit', value: false },
            Destroy: { name: 'Huỷ phiếu chi', code: 'Payslip_Destroy', value: false },
            Accept: { name: 'Duyệt phiếu chi', code: 'Payslip_Accept', value: false },
            Upload: { name: 'Upload chứng từ', code: 'Payslip_Upload', value: false },
            Delete: { name: 'Xóa', code: 'Payslip_Delete', value: false },
            History: { name: 'Lịch sử thao tác', code: 'Payslip_History', value: false },
          },
        ],
      },
  
      // 09. Công việc nội bộ
      // Công việc nội bộ
      InternalWork: {
        id: 9,
        code: 'InternalWork',
        name: 'Công việc nội bộ',
        children: [
          {
            code: 'InternalWorkConfig',
            name: 'Cấu hình giao việc',
            Add: { name: 'Tạo Mới', code: 'InternalWorkConfig_Add', value: false },
            View: { name: 'Xem', code: 'InternalWorkConfig_View', value: false },
            Detail: { name: 'Xem chi tiết', code: 'InternalWorkConfig_Detail', value: false },
            Edit: { name: 'Chỉnh Sửa', code: 'InternalWorkConfig_Edit', value: false },
            Delete: { name: 'Xóa', code: 'InternalWorkConfig_Delete', value: false },
            History: { name: 'Lịch sử thao tác', code: 'InternalWorkConfig_History', value: false },
          },
          // Danh sách công việc
          {
            code: 'Work',
            name: 'Danh sách công việc',
            View: { name: 'Xem', code: 'Work_View', value: false },
            Detail: { name: 'Xem chi tiết', code: 'Work_Detail', value: false },
            Edit: { name: 'Chỉnh Sửa', code: 'Work_Edit', value: false },
            Delete: { name: 'Xóa', code: 'Work_Delete', value: false },
            History: { name: 'Lịch sử thao tác', code: 'Work_History', value: false },
          },
          // Thống kê công việc
          {
            code: 'WorkReport',
            name: 'Thống kê công việc',
            View: { name: 'Xem', code: 'WorkReport_View', value: false },
          },
        ],
      },
    },
  
    ActiveStatus: {
      ACTIVE: { code: 'ACTIVE', name: 'Đang hoạt động', value: false },
      INACTIVE: { code: 'INACTIVE', name: 'Ngưng hoạt động', value: true },
      ALL: { code: 'ACTIVE', name: 'Tất cả', value: null },
    },
  
    ActionLogType: {
      ThemMoi: { code: 'ThemMoi', name: 'Thêm mới', value: false },
      CapNhat: { code: 'CapNhat', name: 'Cập nhật', value: false },
      KichHoat: { code: 'KichHoat', name: 'Kích hoạt', value: false },
      HuyKichHoat: { code: 'HuyKichHoat', name: 'Hủy kích hoạt', value: false },
      ThoiViec: { code: 'ThoiViec', name: 'Thôi việc', value: false },
      Duyet: { code: 'Duyet', name: 'Duyệt', value: false },
      Huy: { code: 'Huy', name: 'Hủy', value: false },
      XacNhan: { code: 'XacNhan', name: 'Xác nhận', value: false },
      TuChoi: { code: 'TuChoi', name: 'Từ chối', value: false },
      KhongChinhXac: { code: 'KhongChinhXac', name: 'Không chính xác', value: false },
      ThaoTac: { code: 'ThaoTac', name: 'Thao tác', value: false },
    },
  
    ManagerRole: {
      Manager: { code: 'Manager', name: 'Quản lý' },
      Director: { code: 'Director', name: 'Giám đốc' },
      Leader: { code: 'Leader', name: 'Leader' },
    },
  
    SettingString: {
      BHXH: {
        code: 'BHXH',
        name: 'Bảo hiểm xã hội (%)',
        value: 8,
        type: 'number',
      },
      BHYT: {
        code: 'BHYT',
        name: 'Bảo hiểm y tế (%)',
        value: 1.5,
        isDeleted: false,
        type: 'number',
      },
      BHTN: {
        code: 'BHTN',
        name: 'Bảo hiểm thất nghiệp (%)',
        value: 1,
        isDeleted: false,
        type: 'number',
      },
    },
  }
  
  export const millisecondInDay = 86400000
  