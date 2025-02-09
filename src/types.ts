export type TResponseOtherParams = {
  error: boolean;
  message: string;
};

export type TGetTokens = {
  accessToken: string;
  refreshToken: string;
};

export type TTokenResponse = {
  data: TGetTokens;
} & TResponseOtherParams;

export type TLoginParams = {
  email: string;
  password: string;
};

export type TGetSessionResponse = {
  data: TUser;
} & TResponseOtherParams;

export type TUser = {
  id?: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  language?: string;
  created_at?: Date;
  last_updated?: Date;
  password?: string;
};

export type TPasswordResponse = {
  data: null;
} & TResponseOtherParams;

export type TQueryPasswordParams = {
  email: string;
};

export type TNumberResponse = {
  data: number;
} & TResponseOtherParams;

export type TBooleanResponse = {
  data: boolean;
} & TResponseOtherParams;

export type TResetPasswordParams = {
  email: string;
  password: string;
  otp: string;
};

export type TAllListStudentResponse = {
  data: TStudent[];
} & TResponseOtherParams;

export type TDateResponse = {
  data: Date;
} & TResponseOtherParams;

export type TGradeListResponse = {
  data: TGrade[];
} & TResponseOtherParams;

export type TContentProps = {
  userData: TUser | null;
  onProfileUpdate: () => void;
};

export type TAllListClassResponse = {
  data: TClass[];
} & TResponseOtherParams;

export type TGenderCountResponse = {
  data: {
    maleCount: number;
    femaleCount: number;
  };
} & TResponseOtherParams;

export type TUpdateResponse = {
  data: Promise<number[]>;
} & TResponseOtherParams;

export type TUserDataProps = {
  userData: TUser | null;
};

export type TClass = {
  id?: number;
  class_name: string;
  explanation: string;
  teacher_id?: number;
  created_at?: Date;
  last_updated?: Date;
};

export type TClassAddResponse = {
  data: TClass;
} & TResponseOtherParams;

export type TStudent = {
  id?: number;
  class_id: number;
  teacher_id?: number;
  id_number: bigint;
  student_name: string;
  student_lastname: string;
  student_number: number;
  gender: string;
  birthdate: Date | null;
};

export type TGrade = {
  id?: number;
  teacher_id?: number;
  student_id: number;
  class_id: number;
  grade_type: string;
  grade_value: number | null;
  created_at?: Date;
  last_updated?: Date;
};

export type TStudentResponse = {
  data: TStudent;
} & TResponseOtherParams;

export type TGradeTypeExists = {
  grade_type: string;
  class_id: number;
};

export type TOpenProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export type TViewDetailDialogProps = {
  student: TStudent;
} & TOpenProps;

export type TUpdateStudentDialogProps = {
  onUpdate: () => void;
} & TViewDetailDialogProps;

export type TAddProps = {
  onAdd: () => void;
} & TOpenProps;

export type TDeleteStudentDialogProps = {
  id: number;
  studentName: string;
  studentLastName: string;
  onDelete: () => void;
} & TOpenProps;

export type TDeleteClassDialogProps = {
  id: number;
  className: string;
  onDelete: () => void;
} & TOpenProps;

export type TUpdateClassDialogProps = {
  id: number;
  className: string;
  explanation: string;
  onUpdate: () => void;
} & TOpenProps;

export type TDateValueType = {
  startDate: Date | null;
  endDate: Date | null;
};

export type TFilteredStudentsProps = {
  setStudents: React.Dispatch<React.SetStateAction<TStudent[]>>;
};

export type TFilterStudentProps = {
  filteredStudents: TStudent[];
  handleFilter: (filtered: TStudent[]) => void;
};

export type TGradeValue = {
  student_id: number;
  grade_value: number | null;
};
