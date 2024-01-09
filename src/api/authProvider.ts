import { notification } from "antd";
import { AxiosInstance } from "axios";
import { TOKEN_KEY, axiosInstance } from "../utils";
import {
  AuthActionResponse,
  CheckResponse,
  IdentityResponse,
  OnErrorResponse,
  PermissionResponse,
} from "@refinedev/core/dist/interfaces";
import { store } from "../redux/store";
import { deleteAllFromCart, mergeCart } from "../redux/slices/cart-slice";

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
  login: async ({ email, password }) => {
    const response = await httpClient.post(`${url}/login`, {
      email,
      password,
    });

    const token = response.data.token ?? null;

    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      const cartState = store.getState().cart;
      store.dispatch(mergeCart(cartState.cartItems));
      return {
        success: true,
        redirectTo: "/",
      };
    } else {
      return {
        success: false,
        error: {
          message: "Login Error",
          name: "Invalid email or password",
        },
      };
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
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Register failed",
          name: "Invalid email or password",
        },
      };
    }
  },

  updatePassword: async ({ password, confirm, oldPassword }) => {
    try {
      const response = await httpClient.put(
        `http://localhost:8080/client/customers/change-password`,
        {
          currentPassword: oldPassword,
          newPassword: password,
          enterThePassword: confirm,
        }
      );
      if (response.status == 200) {
        notification.success({
          message: "Updated Password",
          description: "Password updated successfully",
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
          message: "Cập nhật thất bại",
          name: error.message,
        },
      };
    }
  },

  resetPassword: async ({ password, confirm, token }) => {
    try {
      const response = await httpClient
        .post(`${url}/reset-password?token=${token}`, {
          newPassword: password,
          confirmPassword: confirm,
        })
        .then((res) => {
          return res.data.content;
        });

      notification.success({
        message: "Đặt lại mật khẩu",
        description: "Mật khẩu được đặt lại thành công",
      });
      return {
        success: true,
        redirectTo: "/login",
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: "Đã xảy ra lỗi",
          name: error.message,
        },
      };
    }
  },

  forgotPassword: async ({ email }) => {
    try {
      const response = await httpClient
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
          message: "Đã xảy ra lỗi",
          name: error.message,
        },
      };
    }
  },
  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  onError: async (error) => {
    return { error };
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
      const response = await httpClient
        .get("http://localhost:8080/client/customers/me")
        .then((res) => {
          return res.data.content;
        });

      return response;
    } catch (error: any) {
      console.error("Error fetching identity:", error.message);
      return null;
    }
  },
});
