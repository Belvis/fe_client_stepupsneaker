import cogoToast from "cogo-toast";

// Hàm hiển thị thông báo thành công
export const showSuccessToast = (message: string) => {
  cogoToast.success(message, { position: "bottom-left" });
};

// Hàm hiển thị thông báo lỗi
export const showErrorToast = (message: string) => {
  cogoToast.error(message, { position: "bottom-left" });
};

// Hàm hiển thị thông báo cảnh báo
export const showWarningToast = (message: string) => {
  cogoToast.warn(message, { position: "bottom-left" });
};

// Hàm hiển thị thông báo thông tin
export const showInfoToast = (message: string) => {
  cogoToast.info(message, { position: "bottom-left" });
};
