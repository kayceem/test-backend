
// Mongodb URI remote
export const MONGODB_URI = process.env.MONGODB_URI;
export const SECRET_KEY = process.env.SECRET_KEY;
export const PWD_SALT_ROUNDS = 12;
export const ERROR_NOT_FOUND_DATA = "Error! Cannot found data";
export const ERROR_GET_DATA = "Failed to fetch data";
export const ERROR_GET_DATA_HISTORIES = "Failed to fetch data histories";
export const ERROR_GET_DATA_DETAIL = "Failed to fetch data detail";
export const ERROR_CREATE_DATA = "Failed to create data";
export const ERROR_UPDATE_DATA = "Failed to update data";
export const ERROR_ACCEPT_DATA = "Failed to accept data";
export const ERROR_UPDATE_ACTIVE_DATA = "Failed to update active status";
export const ERROR_CODE_TAKEN = "Code has already used!";
export const ERROR_NAME_TAKEN = "Name has already used!";
export const ERROR_USERNAME_DUPLICATE = "Username has already used!";
export const ERROR_YOU_DO_NOT_HAVE_PERMISSION = "You do not have permission!";
export const ERROR_INVALID_TYPE = "Data type is invalid!";

export const GET_SUCCESS = "Fetch data successfully.";
export const GET_HISOTIES_SUCCESS = "Fetch data histories successfully.";
export const GET_DETAIL_SUCCESS = "Fetch data detail successfully.";
export const CREATE_SUCCESS = "Create data successfully.";
export const UPDATE_SUCCESS = "Update data successfully.";
export const ACCEPT_SUCCESS = "Accept data successfully.";
export const UPDATE_ACTIVE_SUCCESS = "Update active status successfully.";
export const DELETE_SUCCESS = "Delete data successfully.";
export const IMPORT_SUCCESS = "Import data successfully.";
export const ACTION_SUCCESS = "Action successfully.";

export const millisecondInDay = 86400000;

export const COUPON_TYPES = {
  COUPON_TYPE_PERCENT: "",
  COUPON_TYPE_FIXED_AMOUNT: "",
};
