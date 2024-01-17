import cogoToast from "cogo-toast";

// Hàm hiển thị thông báo thành công
export const showSuccessToast = (message: string) => {
  const toast = cogoToast.success(message, {
    position: "bottom-left",
    onClick: () => {
      toast.hide?.();
    },
  });
};

// Hàm hiển thị thông báo lỗi
export const showErrorToast = (message: string) => {
  const toast = cogoToast.error(message, {
    position: "bottom-left",
    onClick: () => {
      toast.hide?.();
    },
  });
};

// Hàm hiển thị thông báo cảnh báo
export const showWarningToast = (message: string) => {
  const toast = cogoToast.warn(message, {
    position: "bottom-left",
    onClick: () => {
      toast.hide?.();
    },
  });
};

// Hàm hiển thị thông báo thông tin
export const showInfoToast = (message: string) => {
  const toast = cogoToast.info(message, {
    position: "bottom-left",
    onClick: () => {
      toast.hide?.();
    },
  });
};
