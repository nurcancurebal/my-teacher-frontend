import React, { useEffect, useState } from "react";
import axios from "axios";
import Datepicker from "react-tailwindcss-datepicker";
import instance from "../services/axiosInstance";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

interface AddStudentProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAdd: () => void;
}

interface ClassItem {
  id: number;
  teacher_id: number;
  class_name: string;
  created_at: Date;
  last_updated: Date;
}

interface DateValueType {
  startDate: Date | null;
  endDate: Date | null;
}

const AddStudent: React.FC<AddStudentProps> = ({ open, setOpen, onAdd }) => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [studentName, setStudentName] = useState<string>("");
  const [studentLastname, setStudentLastName] = useState<string>("");
  const [studentNumber, setStudentNumber] = useState<number>();
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [studentTc, setstudentTc] = useState<string>("");
  const [date, setDate] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });
  const [gender, setGender] = useState<string>("");

  useEffect(() => {
    if (open) {
      getClasses();
      setstudentTc("");
      setStudentName("");
      setStudentLastName("");
      setStudentNumber(0);
      setGender("");
      setDate({ startDate: null, endDate: null });
      setMessage("");
      setError("");
      setSelectedClassId(null);
    }
  }, [open]); // `open` prop'u değiştiğinde `useEffect` çalışır

  const getClasses = async () => {
    try {
      const classes = await instance.get("class");
      setClasses(classes.data.data);
    } catch (error) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const handleAddStudent = async () => {
    setError("");
    setMessage("");

    if (selectedClassId === null) {
      setError("Sınıf seçimi yapılmadı.");
      return;
    }

    if (!date.startDate) {
      setError("Doğum tarihi seçilmedi.");
      return;
    }

    try {
      await instance.post(`student/${selectedClassId}`, {
        tc: studentTc,
        student_name: studentName,
        student_lastname: studentLastname,
        student_number: studentNumber,
        gender,
        birthdate: date.startDate,
      });
      setMessage("Öğrenci başarıyla eklendi.");
      setTimeout(() => {
        setstudentTc("");
        setStudentName("");
        setStudentLastName("");
        setStudentNumber(0);
        setGender("");
        setDate({ startDate: null, endDate: null });
        setMessage("");
        setError("");
        setSelectedClassId(null);
        onAdd();
      }, 3000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message;
        switch (errorMessage) {
          case "'tc' must be a number":
            setError("TC kimlik numarası sayı olmalıdır.");
            break;
          case "'tc' must be exactly 11 digits long":
            setError("TC kimlik numarası 11 haneli olmalıdır.");
            break;

          case "TR ID number has already been used":
            setError("TC kimlik numarası zaten kullanılmış.");
            break;
          case "Student number is required":
            setError("Öğrenci numarası zorunludur.");
            break;
          case '"student_name" is not allowed to be empty':
            setError("Öğrenci adı boş bırakılamaz.");
            break;
          case '"student_name" length must be at least 3 characters long':
            setError("Öğrenci adı en az 3 karakter olmalıdır.");
            break;
          case '"student_name" length must be less than or equal to 30 characters long':
            setError("Öğrenci adı en fazla 30 karakter olmalıdır.");
            break;
          case '"student_lastname" is not allowed to be empty':
            setError("Öğrenci soyadı boş bırakılamaz.");
            break;
          case '"student_lastname" length must be at least 3 characters long':
            setError("Öğrenci soyadı en az 3 karakter olmalıdır.");
            break;
          case '"student_lastname" length must be less than or equal to 30 characters long':
            setError("Öğrenci soyadı en fazla 30 karakter olmalıdır.");
            break;
          case '"student_number" must be a number':
            setError("Öğrenci numarası sayı olmalıdır.");
            break;
          case "'student_number' must be between 2 and 15 characters long":
            setError("Öğrenci numarası 2 ile 15 karakter arasında olmalıdır.");
            break;
          case "Student number is already used":
            setError("Öğrenci numarası zaten kullanılmış.");
            break;
          case '"student_number" is required':
            setError("Öğrenci numarası zorunludur.");
            break;
          case "'gender' must be one of [K, E]":
            setError("Cinsiyet Kadın veya Erkek olarak seçilmelidir.");
            break;
          default:
            setError("Bir hata oluştu. Lütfen tekrar deneyin.");
        }
        return;
      }
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const cancelReturn = () => {
    setOpen(false);
    setstudentTc("");
    setStudentName("");
    setStudentLastName("");
    setStudentNumber(0);
    setGender("");
    setDate({ startDate: null, endDate: null });
    setMessage("");
    setError("");
    setSelectedClassId(null);
  };

  const handleKeyAddStudent = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleAddStudent();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="relative z-10"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:p-12 sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95x"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 sm:mt-0 mx-auto">
                  <DialogTitle
                    as="h3"
                    className="text-2xl font-semibold text-gray-900"
                  >
                    Öğrenci Ekle
                  </DialogTitle>
                </div>
              </div>
            </div>

            <div className="mt-3 mx-6">
              <label
                htmlFor="className"
                className="mt-5 block text-lg font-medium text-gray-900"
              >
                Sınıf Seçiniz:
              </label>
              {classes.map((classItem, index) => (
                <button
                  key={index}
                  type="button"
                  className={`m-2 inline-flex justify-center rounded-md py-2 text-base font-semibold shadow-sm w-24 ring-1 ring-inset ring-gray-300 transition-all text-gray-900 hover:bg-slate-50 focus:bg-slate-200  active:bg-slate-100 ${
                    selectedClassId === classItem.id
                      ? "bg-slate-200"
                      : "bg-white"
                  }`}
                  onClick={() => setSelectedClassId(classItem.id)}
                >
                  {classItem.class_name}
                </button>
              ))}
            </div>

            <div className="m-6">
              <div>
                <label
                  htmlFor="studentName"
                  className="mt-5 block text-lg font-medium text-gray-900"
                >
                  Öğrenci TC:
                </label>

                <input
                  id="studentTc"
                  name="studentTc"
                  type="text"
                  required
                  value={studentTc}
                  onChange={(e) => setstudentTc(e.target.value)}
                  onKeyDown={handleKeyAddStudent}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 text-base p-3"
                />
              </div>

              <div>
                <label
                  htmlFor="studentName"
                  className="mt-5 block text-lg font-medium text-gray-900"
                >
                  Öğrenci Adı:
                </label>

                <input
                  id="studentName"
                  name="studentName"
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  onKeyDown={handleKeyAddStudent}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 text-base p-3"
                />
              </div>

              <div>
                <label
                  htmlFor="studentLastname"
                  className="mt-5 block text-lg font-medium text-gray-900"
                >
                  Öğrenci Soyadı:
                </label>

                <input
                  id="studentLastname"
                  name="studentLastname"
                  type="text"
                  required
                  value={studentLastname}
                  onChange={(e) => setStudentLastName(e.target.value)}
                  onKeyDown={handleKeyAddStudent}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 text-base p-3"
                />
              </div>

              <div>
                <label
                  htmlFor="studentNumber"
                  className="mt-5 block text-lg font-medium text-gray-900"
                >
                  Öğrenci Numarası:
                </label>

                <input
                  id="studentNumber"
                  name="studentNumber"
                  type="text"
                  required
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(Number(e.target.value))}
                  onKeyDown={handleKeyAddStudent}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 text-base p-3"
                />
              </div>

              <div>
                <label
                  htmlFor="studentNumber"
                  className="mt-5 block text-lg font-medium text-gray-900"
                >
                  Öğrenci Cinsiyeti:
                </label>

                <button
                  type="button"
                  className={`m-5 inline-flex justify-center rounded-md py-2 text-base font-semibold shadow-sm w-24 ring-1 ring-inset ring-gray-300 transition-all text-gray-900 hover:bg-slate-50 focus:bg-slate-200  active:bg-slate-100
                    ${gender === "K" ? "bg-slate-200" : "bg-white"}`}
                  onClick={() => setGender("K")}
                >
                  K
                </button>
                <button
                  type="button"
                  className={`m-5 inline-flex justify-center rounded-md py-2 text-base font-semibold shadow-sm w-24 ring-1 ring-inset ring-gray-300 transition-all text-gray-900 hover:bg-slate-50 focus:bg-slate-200  active:bg-slate-100 ${
                    gender === "E" ? "bg-slate-200" : "bg-white"
                  }`}
                  onClick={() => setGender("E")}
                >
                  E
                </button>
              </div>
              <div>
                <label
                  htmlFor="studentNumber"
                  className="mt-5 block text-lg font-medium text-gray-900"
                >
                  Doğum Tarihi:
                </label>

                <Datepicker
                  useRange={false}
                  asSingle={true}
                  required={true}
                  inputId="datepicker"
                  inputName="datepicker"
                  value={date}
                  placeholder="Doğum Tarihi Seçiniz"
                  displayFormat="DD.MM.YYYY"
                  inputClassName="text-base"
                  onChange={(newDate: DateValueType | null) => {
                    if (newDate) {
                      setDate(newDate);
                    }
                  }}
                />
              </div>
            </div>

            {message && (
              <p className="mt-2 text-center text-base text-green-600">
                {message}
              </p>
            )}
            {error && (
              <p className="mt-2 text-center text-base text-red-600">{error}</p>
            )}

            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-green-600 py-2 text-base font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-24 transition-all"
                onClick={handleAddStudent}
              >
                Ekle
              </button>
              <button
                type="button"
                data-autofocus
                onClick={cancelReturn}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white py-2 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-24  transition-all"
              >
                İptal Et
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default AddStudent;
