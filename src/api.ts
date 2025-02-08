import axios from "./plugins/axios";

import { AxiosResponse } from "axios";

import {
  TUser,
  TLoginParams,
  TResetPasswordParams,
  TPasswordResponse,
  TQueryPasswordParams,
  TTokenResponse,
  TClass,
  TStudent,
  TGrade,
  TGradeTypeExists,
  TGetSessionResponse,
  TUpdateResponse,
  TClassAddResponse,
  TNumberResponse,
  TAllListClassResponse,
  TBooleanResponse,
  TAllListStudentResponse,
  TGenderCountResponse,
  TDateResponse,
  TGradeListResponse,
} from "./types";

export default {
  auth: {
    getUser: async (): Promise<AxiosResponse<TGetSessionResponse>> => {
      return await axios.get("auth");
    },
    login: async (
      data: TLoginParams
    ): Promise<AxiosResponse<TTokenResponse>> => {
      return await axios.post("auth/login", data);
    },
    register: async (data: TUser): Promise<AxiosResponse<TTokenResponse>> => {
      return await axios.post("auth/register", data);
    },
    forgotPassword: async (
      data: TQueryPasswordParams
    ): Promise<AxiosResponse<TPasswordResponse>> => {
      return await axios.post("auth/forgot-password", data);
    },
    resetPassword: async (
      data: TResetPasswordParams
    ): Promise<AxiosResponse<TPasswordResponse>> => {
      return await axios.post("auth/reset-password", data);
    },
  },
  profile: {
    update: async (data: TUser): Promise<AxiosResponse<TUpdateResponse>> => {
      return await axios.put("profile", data);
    },
  },
  class: {
    add: async (data: TClass): Promise<AxiosResponse<TClassAddResponse>> => {
      return await axios.post("class", data);
    },
    update: async (data: TClass): Promise<AxiosResponse<TUpdateResponse>> => {
      return await axios.put(`class/${data.id}`, data);
    },
    delete: async (id: number): Promise<AxiosResponse<TNumberResponse>> => {
      return await axios.delete(`class/${id}`);
    },
    allList: async (): Promise<AxiosResponse<TAllListClassResponse>> => {
      return await axios.get("class");
    },
    count: async (): Promise<AxiosResponse<TNumberResponse>> => {
      return await axios.get("class/count");
    },
  },
  student: {
    add: async (data: TStudent): Promise<AxiosResponse<TStudent>> => {
      const { class_id, ...bodyData } = data;
      return await axios.post(`student/${class_id}`, { bodyData });
    },
    update: async (data: TStudent): Promise<AxiosResponse<TNumberResponse>> => {
      const { id, ...bodyData } = data;
      return await axios.put(`student/${id}`, { bodyData });
    },
    delete: async (id: number): Promise<AxiosResponse<TBooleanResponse>> => {
      return await axios.delete(`student/${id}`);
    },
    allList: async (): Promise<AxiosResponse<TAllListStudentResponse>> => {
      return await axios.get("student");
    },
    count: async (): Promise<AxiosResponse<TNumberResponse>> => {
      return await axios.get("student/count");
    },
    genderCount: async (): Promise<AxiosResponse<TGenderCountResponse>> => {
      return await axios.get("student/gender-count");
    },
    getListByClass: async (
      classId: number
    ): Promise<AxiosResponse<TAllListStudentResponse>> => {
      return await axios.get(`student/${classId}`);
    },
    countByClass: async (
      classId: number
    ): Promise<AxiosResponse<TNumberResponse>> => {
      return await axios.get(`student/${classId}/class-count`);
    },
  },
  grade: {
    findLatestGrade: async (): Promise<AxiosResponse<TDateResponse>> => {
      return await axios.get("grade/last-added");
    },
    classFindAll: async (
      classId: number
    ): Promise<AxiosResponse<TGradeListResponse>> => {
      return await axios.get(`grade/${classId}`);
    },
    gradeTypeExists: async (
      data: TGradeTypeExists
    ): Promise<AxiosResponse<TBooleanResponse>> => {
      return await axios.post(`grade/${data.class_id}`, data.grade_type);
    },
    add: async (data: TGrade): Promise<AxiosResponse<TGrade>> => {
      const { class_id, student_id, ...bodyData } = data;

      return await axios.post(`grade/${class_id}/${student_id}`, bodyData);
    },
    update: async (data: TGrade): Promise<AxiosResponse<TNumberResponse>> => {
      const { class_id, student_id, id, ...bodyData } = data;
      return await axios.put(`grade/${class_id}/${student_id}/${id}`, bodyData);
    },
  },
};
