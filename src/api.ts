import { data } from "react-router-dom";
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
  TGrade,
  TGradeTypeExists,
  TAddGradeParams,
  TUpdateGradeParams,
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
      const { class_id, ...bodyData } = data;
      return await axios.post(`student/${class_id}`, { bodyData });
    },
    update: async (data: TStudent): Promise<number> => {
      const { id, ...bodyData } = data;
      return await axios.put(`student/${id}`, { bodyData });
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
  grade: {
    findLatestGrade: async () => {
      return await axios.get("grade/last-added");
    },
    classFindAll: async (classId: number): Promise<TGrade[]> => {
      return await axios.get(`grade/${classId}`);
    },
    gradeTypeExists: async (data: TGradeTypeExists): Promise<boolean> => {
      return await axios.post(`grade/${data.class_id}`, data.grade_type);
    },
    add: async (data: TAddGradeParams): Promise<TGrade> => {
      const { class_id, student_id, ...bodyData } = data;

      return await axios.post(`grade/${class_id}/${student_id}`, bodyData);
    },
    update: async (data: TUpdateGradeParams): Promise<number> => {
      const { class_id, student_id, id, ...bodyData } = data;
      return await axios.put(`grade/${class_id}/${student_id}/${id}`, bodyData);
    },
  },
};
