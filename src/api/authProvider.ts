import { AuthBindings } from "@refinedev/core";
import { notification } from "antd";
import { AxiosInstance } from "axios";
import { axiosInstance } from "../utils";

export const TOKEN_KEY = "suns-auth-client-token";

const httpClient: AxiosInstance = axiosInstance;

export const authProvider = (url: string): AuthBindings => ({
  login: async ({ email, password }) => {
    const response = await httpClient.post(`${url}/login`, {
      email,
      password,
    });
    const token = response.data.token ?? null;

    if (token) localStorage.setItem(TOKEN_KEY, token);

    return {
      success: true,
      redirectTo: "/",
    };
  },
  register: async ({ email, password }) => {
    try {
      const response = await httpClient.post(`${url}/login`, {
        email,
        password,
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
  updatePassword: async () => {
    notification.success({
      message: "Updated Password",
      description: "Password updated successfully",
    });
    return {
      success: true,
    };
  },
  forgotPassword: async ({ email }) => {
    notification.success({
      message: "Reset Password",
      description: `Reset password link sent to "${email}"`,
    });
    return {
      success: true,
    };
  },
  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    return {
      success: true,
      redirectTo: "pages/login",
    };
  },
  onError: async (error) => {
    console.error(error);

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

    const response = await httpClient.get(
      `http://localhost:8080/client/customers/me`
    );

    const identity = response.data ?? null;

    console.log(identity);

    return identity;
  },
});
