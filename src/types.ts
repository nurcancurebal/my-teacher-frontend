export type TUser = {
  id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  created_at: Date;
  last_updated: Date;
};

export type TRouterProps = {
  userData: TUser | null;
  onProfileUpdate: () => void;
};

export type TUpdateProfileProps = {
  userData: TUser | null;
  onProfileUpdate: () => void;
};

export type TContentProps = {
  userData: TUser | null;
  onProfileUpdate: () => void;
};

export type TNavbarProps = {
  userData: TUser | null;
};

export type TQueryResetPassword = {
  email: string;
};

export type TLoginParams = {
  email: string;
  password: string;
};

export type TRegisterParams = {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
};

export type TRegisterResponse = {
  data: TUser;
  error: boolean;
  accessToken: string;
  message: string;
};

export type TLoginResponse = {
  data: TUser;
  error: boolean;
  accessToken: string;
};

export type TForgotPasswordParams = {
  email: string;
};
export type TForgotPasswordResponse = {
  message: string;
  error: boolean;
};

export type TResetPasswordParams = {
  email: string;
  password: string;
  otp: string;
};

export type TResetPasswordResponse = {
  updated: string;
  message: string;
  error: boolean;
};

export type TAddClassParams = {
  class_name: string;
  explanation: string;
};
export type TUpdateClassParams = {
  class_name: string;
  explanation: string;
};

export type TClass = {
  id?: number;
  class_name: string;
  explanation: string;
  teacher_id: number;
  created_at?: Date;
  last_updated?: Date;
};

export type TStudent = {
  id?: number;
  class_id: number;
  teacher_id: number;
  id_number: bigint;
  student_name: string;
  student_lastname: string;
  student_number: number;
  gender: string;
  birthdate: Date;
};
