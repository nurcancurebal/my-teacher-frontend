import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import instance from "../services/axiosInstance";

interface SelectGradeProps {
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

interface GradeType {
  grade_type: string;
}

const SelectGrade: React.FC<SelectGradeProps> = ({ open, setOpen }) => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [showStudentSelection, setShowStudentSelection] =
    useState<boolean>(true);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [gradeName, setGradeName] = useState<string>("");
  const [gradeType, setGradeType] = useState<string[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      getClasses();
      setShowStudentSelection(true);
      setMessage("");
      setError("");
      setSelectedClassId(null);
      setGradeName("");
    }
  }, [open]);

  const getClasses = async () => {
    try {
      const classes = await instance.get("class");
      setClasses(classes.data.data);
    } catch (error) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const handleSelectGrade = async () => {
    setError("");
    setMessage("");

    if (showStudentSelection && selectedClassId !== null) {
      setShowStudentSelection(false);

      try {
        const notesInClass = await instance.get(`grade/${selectedClassId}/`);

        const uniqueGradeTypes = Array.from(
          new Set(
            (notesInClass.data.data as GradeType[]).map(
              (note: GradeType) => note.grade_type
            )
          )
        );
        if (uniqueGradeTypes.length === 0) {
          setError("Sınıfta not bulunmamaktadır.");
          return;
        }
        setGradeType(uniqueGradeTypes);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const errorMessage = error.response.data.message;

          switch (errorMessage) {
            case "Invalid class_id":
              setError("Geçersiz sınıf.");
              break;
            case "Class not found or not authorized":
              setError("Sınıf bulunamadı veya yetkiniz yok.");
              break;
            default:
              setError("Bir hata oluştu. Lütfen tekrar deneyin.");
          }
          return;
        }
        setError("Bir hata oluştu. Lütfen tekrar deneyin.");
      }

      return;
    }

    if (showStudentSelection && selectedClassId === null) {
      setError("Sınıf seçimi yapılmadı.");
      return;
    }

    if (gradeName !== "") {
      setMessage("Not güncellemek için yönlendiriliyorsunuz.");
      setTimeout(() => {
        navigate("/update-grade", {
          state: { selectedClassId, gradeName },
        });
        setGradeName("");
      }, 3000);
    }
  };

  const cancelReturn = () => {
    setShowStudentSelection(true);
    setError("");
    setGradeName("");
    setMessage("");
    setGradeType([]);

    if (showStudentSelection) {
      setOpen(false);
      return;
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
        <div className="flex min-h-full items-end justify-center p-4 text-center items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:p-12 sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="text-left">
                  <DialogTitle
                    as="h3"
                    className="text-2xl font-semibold text-gray-900"
                  >
                    {showStudentSelection
                      ? "Bir sınıf seçiniz?"
                      : "Hangi notu güncellemek istediğinizi seçiniz."}
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
                {gradeType.map((grade, index) => (
                  <button
                    key={index}
                    type="button"
                    className="m-5 inline-flex justify-center rounded-md bg-white text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 w-24 py-2"
                    onClick={() => setGradeName(grade)}
                  >
                    {grade}
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
                onClick={handleSelectGrade}
              >
                Devam Et
              </button>
              <button
                type="button"
                data-autofocus
                onClick={cancelReturn}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white py-2 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-24"
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

export default SelectGrade;
