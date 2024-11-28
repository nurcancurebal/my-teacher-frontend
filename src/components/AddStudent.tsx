import React, { useEffect, useState } from "react";
import axios from "axios";
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
}

interface ClassItem {
  id: number;
  teacher_id: number;
  class_name: string;
}

const AddStudent: React.FC<AddStudentProps> = ({ open, setOpen }) => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [studentName, setStudentName] = useState<string>("");
  const [studentLastname, setStudentLastName] = useState<string>("");
  const [studentNumber, setStudentNumber] = useState<number>();
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [showStudentSelection, setShowStudentSelection] =
    useState<boolean>(true);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  useEffect(() => {
    if (open) {
      getClasses();
      setShowStudentSelection(true);
      setStudentName("");
      setStudentLastName("");
      setStudentNumber(0);
      setMessage("");
      setError("");
    }
  }, [open]); // `open` prop'u değiştiğinde `useEffect` çalışır

  const getClasses = async () => {
    try {
      const classes = await instance.get("class");
      console.log(classes.data.data);
      setClasses(classes.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddStudent = async () => {
    setError("");
    setMessage("");

    console.log(
      "showStudentSelection",
      showStudentSelection,
      "selectedClassId",
      selectedClassId
    );

    if (showStudentSelection && selectedClassId !== null) {
      setShowStudentSelection(false);
      return;
    }

    if (showStudentSelection && selectedClassId === null) {
      setError("Sınıf seçimi yapılmadı.");
      return;
    }

    try {
      await instance.post("student", {
        class_id: selectedClassId,
        student_name: studentName,
        student_lastname: studentLastname,
        student_number: studentNumber,
      });
      setMessage("Öğrenci başarıyla eklendi.");
      setTimeout(() => {
        setStudentName("");
        setStudentLastName("");
        setStudentNumber(0);
        setMessage("");
        setError("");
      }, 3000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message;
        switch (errorMessage) {
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
          default:
            console.log(errorMessage);
            setError("Bir hata oluştu. Lütfen tekrar deneyin.");
        }
        return;
      }
      console.log("aaaa", error);
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
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
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:p-12 sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-2xl font-semibold text-gray-900"
                  >
                    {showStudentSelection
                      ? "Hangi sınıfa eklemek istersiniz?"
                      : "Öğrenci Ekle"}
                  </DialogTitle>
                </div>
              </div>
            </div>
            {showStudentSelection ? (
              <div className="mt-3">
                {classes.map((classItem, index) => (
                  <button
                    key={index}
                    type="button"
                    className="m-5 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 sm:mt-0 sm:w-24"
                    onClick={() => setSelectedClassId(classItem.id)}
                  >
                    {classItem.class_name}
                  </button>
                ))}
              </div>
            ) : (
              <div className="m-6">
                <div>
                  <label
                    htmlFor="studentName"
                    className="mt-5 block text-base font-medium text-gray-900"
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
                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-lg p-3"
                  />
                </div>

                <div>
                  <label
                    htmlFor="studentLastname"
                    className="mt-5 block text-base font-medium text-gray-900"
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
                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-lg p-3"
                  />
                </div>

                <div>
                  <label
                    htmlFor="studentNumber"
                    className="mt-5 block text-base font-medium text-gray-900"
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
                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-lg p-3"
                  />
                </div>
              </div>
            )}

            {message && (
              <p className="mt-2 text-center text-sm/6 text-green-600">
                {message}
              </p>
            )}
            {error && (
              <p className="mt-2 text-center text-sm/6 text-red-600">{error}</p>
            )}

            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-24"
                onClick={handleAddStudent}
              >
                {showStudentSelection ? "Devam Et" : "Ekle"}
              </button>
              <button
                type="button"
                data-autofocus
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 sm:mt-0 sm:w-24"
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
