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
  createdAt?: Date;
  lastUpdated?: Date;
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

export type TGradeType = {
  gradeType: string;
  createAt: Date;
  lastUpdated: Date;
};

export type TGrareTypeAllResponse = {
  data: TGradeType[];
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
  className: string;
  explanation: string;
  teacherId?: number;
  createdAt?: Date;
  lastUpdated?: Date;
};

export type TClassAddResponse = {
  data: TClass;
} & TResponseOtherParams;

export type TStudent = {
  id?: number;
  classId: number;
  teacherId?: number;
  idNumber: string;
  studentName: string;
  studentLastname: string;
  studentNumber: number;
  gender: string;
  birthdate: Date | null;
};

export type TGrade = {
  id?: number;
  teacherId?: number;
  studentId: number;
  classId: number;
  gradeType: string;
  gradeValue: number | null;
  createdAt?: Date;
  lastUpdated?: Date;
};

export type TStudentResponse = {
  data: TStudent;
} & TResponseOtherParams;

export type TGradeTypeExists = {
  gradeType: string;
  classId: number;
};

export type TOpenProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export type TGradeUpdateProps = {
  open: boolean;
  onClose: () => void;
  grade: TGradeType | null;
  setNewGradeType: React.Dispatch<React.SetStateAction<string>>;
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

export type TFilteredStudentsProps = {
  setStudents: React.Dispatch<React.SetStateAction<TStudent[]>>;
};

export type TFilterStudentInputProps = {
  value: string;
  placeholder: string;
} & TFilterStudentMenuProps;

export type TFilterStudentMenuProps = {
  setValue: React.Dispatch<React.SetStateAction<string>>;
};

export type TGradeValue = {
  studentId: number;
  gradeValue: number | null;
};
