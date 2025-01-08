import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import instance from "../services/axiosInstance";

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

  useEffect(() => {
    if (open) {
      const getClasses = async () => {
        try {
          const classes = await instance.get("class");
          setClasses(classes.data.data);
        } catch (error) {
          setError(
            "Sınıfları getirirken bir hata oluştu. Lütfen tekrar deneyin."
          );
        }
      };
      getClasses();
    }
  }, [open]);

  const handleSelectClass = async () => {
    setError("");
    setMessage("");

    if (showStudentSelection && selectedClassId !== null) {
      setShowStudentSelection(false);
      try {
        const students = await instance.get(`student/${selectedClassId}`);
        setStudents(students.data.data);
      } catch (error) {}
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
      return;
    }
  };

  const cancelReturn = () => {
    if (showStudentSelection) {
      setOpen(false);
      return;
    }
    setShowStudentSelection(true);
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
        <div className="flex min-h-full items-end justify-center p-4 text-left items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:p-12 sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
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
            </div>

            {showStudentSelection ? (
              <div className="mt-3">
                {classes.map((classItem, index) => (
                  <button
                    key={index}
                    type="button"
                    className="m-5 inline-flex justify-center rounded-md bg-white text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 w-24 py-2"
                    onClick={() => setSelectedClassId(classItem.id)}
                  >
                    {classItem.class_name}
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-3">
                {students.map((studentItem, index) => (
                  <button
                    key={index}
                    type="button"
                    className="m-5 inline-flex justify-center rounded-md bg-white text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 w-24 py-2"
                    onClick={() => setSelectedStudentId(studentItem.id)}
                  >
                    {studentItem.student_name}
                  </button>
                ))}
              </div>
            )}

            {message && (
              <p className="mt-2 text-center text-base text-green-600">
                {message}
              </p>
            )}
            {error && (
              <p className="mt-2 text-center text-base text-red-600">{error}</p>
            )}

            <div className="my-5 bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-green-600 py-2 text-base font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-24"
                onClick={handleSelectClass}
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
