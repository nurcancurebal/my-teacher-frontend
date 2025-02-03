import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

import axios from "../../plugins/axios";

interface SelectTeacherNoteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface ClassItem {
  id: number;
  teacher_id: number;
  class_name: string;
  created_at: Date;
  last_updated: Date;
}

interface StudentItem {
  id: number;
  class_id: number;
  teacher_id: number;
  student_name: string;
  student_lastname: string;
  student_number: number;
}

const SelectTeacherNote: React.FC<SelectTeacherNoteProps> = ({
  open,
  setOpen,
}) => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [showStudentSelection, setShowStudentSelection] =
    useState<boolean>(true);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );
  const navigate = useNavigate();

  const isDisabled = classes.length === 0;

  useEffect(() => {
    if (open) {
      const fetchClasses = async () => {
        try {
          const response = await axios.get("class");
          const classes = response.data.data;
          if (classes.length > 0) {
            setClasses(classes);
          } else {
            setError("Sınıf bulunamadı. Lütfen önce sınıf ekleyin.");
          }
        } catch (error) {
          setError(
            "Sınıfları getirirken bir hata oluştu. Lütfen tekrar deneyin."
          );
        }
      };
      fetchClasses();
      resetSelections();
    }
  }, [open]);

  const resetSelections = () => {
    setSelectedClassId(null);
    setSelectedStudentId(null);
    setShowStudentSelection(true);
    setError("");
    setMessage("");
  };

  const handleSelectClass = async () => {
    setError("");
    setMessage("");

    if (showStudentSelection && selectedClassId !== null) {
      try {
        const response = await axios.get(`student/${selectedClassId}`);
        const students = response.data.data;
        if (students.length === 0) {
          setError("Bu sınıfta öğrenci bulunamadı.");
          setStudents([]);
          return;
        }
        setStudents(students);
        setShowStudentSelection(false);
      } catch (error) {
        setError(
          "Öğrencileri getirirken bir hata oluştu. Lütfen tekrar deneyin."
        );
      }
      return;
    }

    if (showStudentSelection && selectedClassId === null) {
      setError("Sınıf seçimi yapılmadı.");
      return;
    }

    if (selectedStudentId) {
      setMessage("Öğrenci seçimi başarılı. Not eklemeye yönlendiriliyorsunuz.");
      setTimeout(() => {
        navigate("/ogretmen-notu-ekle", {
          state: { selectedClassId, selectedStudentId },
        });
      }, 3000);
    } else {
      setError("Öğrenci seçimi yapılamadı.");
    }
  };

  const cancelReturn = () => {
    if (showStudentSelection) {
      setOpen(false);
      return;
    } else {
      setShowStudentSelection(true);
    }
    setError("");
    setMessage("");
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
        <div className="flex min-h-full items-end justify-center text-left items-center">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-md bg-white shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 p-5 sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="p-5">
              <div className="sm:flex sm:items-start pb-5">
                <div className="text-left">
                  <DialogTitle
                    as="h3"
                    className="text-2xl font-semibold text-gray-900"
                  >
                    {showStudentSelection
                      ? "Öğrencinin bulunduğu sınıfı seçiniz."
                      : "Not eklemek istediğiniz öğrenciyi seçiniz."}
                  </DialogTitle>
                </div>
              </div>

              {showStudentSelection ? (
                <div className="grid sm:grid-cols-3 grid-cols-2 gap-1">
                  {classes.map((classItem, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`mx-auto m-4 inline-flex w-24 py-2 justify-center rounded-md text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 focus:bg-gray-200 active:bg-gray-100 transition-all ${
                        selectedClassId === classItem.id
                          ? "bg-gray-200"
                          : "bg-white"
                      }`}
                      onClick={() => {
                        setSelectedClassId(classItem.id);
                        setError("");
                        setMessage("");
                      }}
                    >
                      {classItem.class_name}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid sm:grid-cols-3 grid-cols-2 gap-1">
                  {students.map((studentItem, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`mx-auto m-4 inline-flex w-24 py-2 justify-center rounded-md text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 focus:bg-gray-200 active:bg-gray-100 transition-all ${
                        selectedStudentId === studentItem.id
                          ? "bg-gray-200"
                          : "bg-white"
                      }`}
                      onClick={() => setSelectedStudentId(studentItem.id)}
                    >
                      {studentItem.student_name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {message && (
              <p className="text-center text-base text-green-600">{message}</p>
            )}
            {error && (
              <p className="text-center text-base text-red-600">{error}</p>
            )}

            <div className="bg-gray-50 p-5 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-green-600 py-2 text-base font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-24 disabled:opacity-75 disabled:hover:bg-green-600"
                onClick={handleSelectClass}
                disabled={isDisabled}
              >
                Devam Et
              </button>
              <button
                type="button"
                data-autofocus
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white py-2 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-24"
                onClick={cancelReturn}
              >
                {showStudentSelection ? "İptal Et" : "Geri Dön"}
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default SelectTeacherNote;
