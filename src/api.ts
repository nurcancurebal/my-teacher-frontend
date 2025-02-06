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
  TClass,
  TAddClassParams,
  TUpdateClassParams,
  TStudent,
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
  class: {
    add: async (data: TAddClassParams): Promise<{ data: TClass }> => {
      return await axios.post("class", data);
    },
    update: async (id: number, data: TUpdateClassParams): Promise<number[]> => {
      return await axios.put(`class/${id}`, data);
    },
    delete: async (id: number): Promise<number> => {
      return await axios.delete(`class/${id}`);
    },
    allList: async (): Promise<TClass> => {
      return await axios.get("class");
    },
    count: async (): Promise<number> => {
      return await axios.get("class/count");
    },
  },
  student: {
    add: async (data: TStudent): Promise<TStudent> => {
      return await axios.post(`student/${data.class_id}`, { data });
    },
    update: async (data: TStudent): Promise<number> => {
      return await axios.put(`student/${data.id}`, { data });
    },
    delete: async (id: number): Promise<boolean> => {
      return await axios.delete(`student/${id}`);
    },
    allList: async (): Promise<TStudent[]> => {
      return await axios.get("student");
    },
    count: async (): Promise<number> => {
      return await axios.get("student/count");
    },
    genderCount: async (): Promise<{
      maleCount: number;
      femaleCount: number;
    }> => {
      return await axios.get("student/gender-count");
    },
    getListByClass: async (classId: number): Promise<TStudent[]> => {
      return await axios.get(`student/${classId}`);
    },
    countByClass: async (classId: number): Promise<number> => {
      return await axios.get(`student/${classId}/class-count`);
    },
  },
  grade: {},
};
