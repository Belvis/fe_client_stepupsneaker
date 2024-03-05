import { TranslateFunction } from "@refinedev/core/dist/interfaces/bindings/i18n";
import { RuleObject } from "antd/es/form";
import { PhoneNumberUtil } from "google-libphonenumber";

// To do: tạo validator chung sử dụng cho nhiều fields

export const validatePhoneNumber = (_: RuleObject, value: string) => {
  if (!value) {
    return Promise.reject("Số điện thoại không được để trống!");
  }

  const phoneUtil = PhoneNumberUtil.getInstance();

  try {
    const number = phoneUtil.parseAndKeepRawInput(value, "VN");

    if (!phoneUtil.isValidNumber(number)) {
      return Promise.reject("Số điện thoại không hợp lệ!");
    }
  } catch (error) {
    return Promise.reject("Số điện thoại không hợp lệ!");
  }

  return Promise.resolve();
};

export const validateEmail = (_: RuleObject, value: string) => {
  if (!value) {
    return Promise.reject("Email không được để trống!");
  }

  const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/;

  if (!emailRegex.test(value)) {
    return Promise.reject("Email không hợp lệ!");
  }

  return Promise.resolve();
};

export const validateFullName = (_: RuleObject, value: string) => {
  if (!value || value.trim() === "") {
    return Promise.reject("Họ và tên không được để trống!");
  }

  const nameRegex = /^[a-zA-Z0-9 ]*$/;
  if (!nameRegex.test(value)) {
    return Promise.reject("Họ và tên chỉ được chứa chữ cái và số!");
  }

  return Promise.resolve();
};

export const validateCommon = (
  _: RuleObject,
  value: string,
  t: TranslateFunction,
  fieldName: string
) => {
  if (!value || value.trim() === "") {
    return Promise.reject(t(`validator.message.${fieldName}`));
  }

  return Promise.resolve();
};

export const validatePassword = (_: RuleObject, value: string) => {
  if (!value) {
    return Promise.reject("Vui lòng nhập mật khẩu");
  }

  // Should have 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character and be at least 8 characters long
  const passwordRegex =
    /(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/;

  if (!passwordRegex.test(value)) {
    return Promise.reject(
      "Mật khẩu không hợp lệ! Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm ít nhất một chữ số, một chữ cái viết thường, một chữ cái viết hoa và một ký tự đặc biệt!"
    );
  }

  return Promise.resolve();
};
