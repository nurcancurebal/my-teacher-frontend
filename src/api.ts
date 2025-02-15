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
  TStudentResponse,
  TGrareTypeAllResponse,
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
      const { id, ...bodyData } = data;
      return await axios.put(`profile/${id}`, bodyData);
    },
  },
  class: {
    add: async (data: TClass): Promise<AxiosResponse<TClassAddResponse>> => {
      return await axios.post("class", data);
    },
    update: async (data: TClass): Promise<AxiosResponse<TUpdateResponse>> => {
      const { id, ...bodyData } = data;
      return await axios.put(`class/${id}`, bodyData);
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
    add: async (data: TStudent): Promise<AxiosResponse<TStudentResponse>> => {
      const { classId, ...bodyData } = data;
      return await axios.post(`student/${classId}`, bodyData);
    },
    update: async (data: TStudent): Promise<AxiosResponse<TNumberResponse>> => {
      const { id, ...bodyData } = data;
      return await axios.put(`student/${id}`, bodyData);
    },
    delete: async (id: number): Promise<AxiosResponse<TBooleanResponse>> => {
      return await axios.delete(`student/${id}`);
    },
    allList: async (): Promise<AxiosResponse<TAllListStudentResponse>> => {
      return await axios.get("student");
    },
    filterStudent: async (filter: {
      firstname?: string;
      lastname?: string;
      number?: number;
      gender?: string;
      classId?: number;
    }): Promise<AxiosResponse<TAllListStudentResponse>> => {
      let address = "student/filter";
      let query = "";

      for (const key in filter) {
        const typedKey = key as keyof typeof filter;
        if (filter[typedKey]) {
          query += `${key}=${filter[typedKey]}&`;
        }
      }

      if (query) {
        address += `?${query}`;
      }

      if (address.endsWith("&")) {
        address = address.slice(0, -1);
      }

      return await axios.get(address);
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
    allUniqueGradeType: async (): Promise<
      AxiosResponse<TGrareTypeAllResponse>
    > => {
      return await axios.get("grade/grade-type/unique");
    },
    allUniqueGradeTypeByClass: async (
      classId: number
    ): Promise<AxiosResponse<TGrareTypeAllResponse>> => {
      return await axios.get(`grade/grade-type/unique/${classId}`);
    },
    allGradeType: async (
      gradeType: string
    ): Promise<AxiosResponse<TGradeListResponse>> => {
      return await axios.post("grade/grade-type", { gradeType });
    },
    findLatestGrade: async (): Promise<AxiosResponse<TDateResponse>> => {
      return await axios.get("grade/last-added");
    },
    studentFindAll: async (
      studentId: number
    ): Promise<AxiosResponse<TGradeListResponse>> => {
      return await axios.get(`grade/student/${studentId}`);
    },
    classFindAll: async (
      classId: number
    ): Promise<AxiosResponse<TGradeListResponse>> => {
      return await axios.get(`grade/class/${classId}`);
    },
    gradeTypeExists: async (
      data: TGradeTypeExists
    ): Promise<AxiosResponse<TBooleanResponse>> => {
      return await axios.post(`grade/${data.classId}`, {
        gradeType: data.gradeType,
      });
    },
    add: async (data: TGrade): Promise<AxiosResponse<TGrade>> => {
      const { classId, studentId, ...bodyData } = data;

      return await axios.post(`grade/${classId}/${studentId}`, bodyData);
    },
    update: async (data: TGrade): Promise<AxiosResponse<TNumberResponse>> => {
      const { classId, studentId, id, ...bodyData } = data;
      return await axios.put(`grade/${classId}/${studentId}/${id}`, bodyData);
    },
    deleteAllGradeType: async (
      gradeType: string
    ): Promise<AxiosResponse<TNumberResponse>> => {
      return await axios.delete(`grade/${gradeType}`);
    },
    classIdGrade: async (
      classId: number,
      gradeType: string
    ): Promise<AxiosResponse<TGradeListResponse>> => {
      return await axios.post(`grade/grade-type/${classId}`, { gradeType });
    },
    deleteOne: async (id: number): Promise<AxiosResponse<TNumberResponse>> => {
      return await axios.delete(`grade/${id}`);
    },
  },
};
