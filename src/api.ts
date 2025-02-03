import axios from "./plugins/axios";

import {
  TUser,
  TLoginParams,
  TRegisterParams,
  TRegisterResponse,
  TLoginResponse,
  TForgotPasswordParams,
  TForgotPasswordResponse,
  TResetPasswordParams,
  TResetPasswordResponse,
} from "./types";

export default {
  auth: {
    getUser: async (): Promise<{ data: { data: TUser } }> => {
      return await axios.get("user");
    },
    login: async (data: TLoginParams): Promise<{ data: TLoginResponse }> => {
      return await axios.post("auth/login", data);
    },
    register: async (
      data: TRegisterParams
    ): Promise<{ data: TRegisterResponse }> => {
      return await axios.post("auth/register", data);
    },
    forgotPassword: async (
      data: TForgotPasswordParams
    ): Promise<{ data: TForgotPasswordResponse }> => {
      return await axios.post("auth/forgot-password", data);
    },
    resetPassword: async (
      data: TResetPasswordParams
    ): Promise<{ data: TResetPasswordResponse }> => {
      return await axios.post("auth/reset-password", data);
    },
    profileUpdate: async () => {},
  },
  class: {},
  student: {},
  grade: {},
  teacherNote: {},
};
