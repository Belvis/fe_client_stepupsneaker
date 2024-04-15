import { notification } from "antd";
import { AxiosInstance } from "axios";
import { TOKEN_KEY, axiosInstance } from "../utils";
import { store } from "../redux/store";
import { deleteAllFromCart, mergeCart } from "../redux/slices/cart-slice";
import { showSuccessToast } from "../helpers/toast";
import { clearOrder } from "../redux/slices/order-slice";
import {
  PermissionResponse,
  AuthActionResponse,
  CheckResponse,
  IdentityResponse,
  OnErrorResponse,
} from "@refinedev/core/dist/contexts/auth/types";

const httpClient: AxiosInstance = axiosInstance;

type AuthBindings = {
  login: (params: any) => Promise<AuthActionResponse>;
  logout: (params: any) => Promise<AuthActionResponse>;
  check: (params?: any) => Promise<CheckResponse>;
  onError: (error: any) => Promise<OnErrorResponse>;
  register?: (params: any) => Promise<AuthActionResponse>;
  forgotPassword?: (params: any) => Promise<AuthActionResponse>;
  updatePassword?: (params: any) => Promise<AuthActionResponse>;
  resetPassword: (params: any) => Promise<AuthActionResponse>;
  getPermissions?: (params?: any) => Promise<PermissionResponse>;
  getIdentity?: (params?: any) => Promise<IdentityResponse>;
};

export const authProvider = (url: string): AuthBindings => ({
  login: async ({ email, password, remember }) => {
    try {
      const token = await httpClient
        .post(`${url}/login`, {
          email,
          password,
        })
        .then((res) => {
          const token = res.data.token ?? null;
          if (remember) {
            localStorage.setItem("SUNS_USER_INFO_EMAIL", email);
            localStorage.setItem("SUNS_USER_INFO_PASS", password);
          } else {
            localStorage.removeItem("SUNS_USER_INFO_EMAIL");
            localStorage.removeItem("SUNS_USER_INFO_PASS");
          }
          return token;
        });

      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
        const cartState = store.getState().cart;
        store.dispatch(mergeCart(cartState.cartItems));
        showSuccessToast("Đăng nhập thành công");
        // Resolve the promise with success data
        return Promise.resolve({
          success: true,
          redirectTo: "/",
        });
      } else {
        // Resolve the promise with error data
        return Promise.resolve({
          success: false,
          error: {
            message: "Đăng nhập thất bại",
            name: "Sai mật khẩu hoặc email",
          },
        });
      }
    } catch (error: any) {
      // Handle any exceptions and reject the promise
      return Promise.resolve({
        success: false,
        error: {
          message: "Đăng nhập thất bại",
          name: error.message,
        },
      });
    }
  },

  register: async ({ email, password, fullName, dateOfBirth, gender }) => {
    try {
      const response = await httpClient.post(`${url}/register-customers`, {
        email,
        password,
        fullName,
        dateOfBirth,
        gender,
      });

      const token = response.data.token ?? null;

      if (token) localStorage.setItem(TOKEN_KEY, token);

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: "Oops..",
          name: error.message,
        },
      };
    }
  },

  updatePassword: async ({ password, confirm, oldPassword }) => {
    try {
      const response = await httpClient.put(`${url}/change-password`, {
        currentPassword: oldPassword,
        newPassword: password,
        enterThePassword: confirm,
      });
      if (response.status == 200) {
        notification.success({
          message: "Thành công",
          description: "Mật Khẩu đã được cập nhật",
        });
        return {
          success: true,
        };
      } else {
        return Promise.reject();
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: "Oops..",
          name: error.message,
        },
      };
    }
  },

  resetPassword: async ({ password, confirm, token }) => {
    try {
      await httpClient
        .post(`${url}/reset-password?token=${token}`, {
          newPassword: password,
          confirmPassword: confirm,
        })
        .then((res) => {
          return res.data.content;
        });

      return {
        success: true,
        redirectTo: "/login",
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: "Oops..",
          name: error.message,
        },
      };
    }
  },

  forgotPassword: async ({ email }) => {
    try {
      await httpClient
        .post(`${url}/forgot-password?email=${email}`)
        .then((res) => {
          return res.data.content;
        });

      notification.success({
        message: "Đặt lại mật khẩu",
        description: `Liên kết đặt lại mật khẩu đã được gửi tới "${email}"`,
      });
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: "Oops..",
          name: error.message,
        },
      };
    }
  },

  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    store.dispatch(deleteAllFromCart());
    store.dispatch(clearOrder());

    return {
      success: true,
      redirectTo: "/login",
    };
  },

  onError: async (error) => {
    if (error.statusCode === 401 || error.statusCode === 403) {
      localStorage.removeItem(TOKEN_KEY);

      return {
        logout: true,
        redirectTo: "/login",
        error,
      };
    }

    return {};
  },
  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      error: {
        message: "Check failed",
        name: "Token not found",
      },
      logout: true,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      return null;
    }

    try {
      const response = await httpClient.get(`${url}/client/me`).then((res) => {
        return res.data.content;
      });

      return response;
    } catch (error: any) {
      console.error("Error fetching identity:", error.message);
      return null;
    }
  },
});
