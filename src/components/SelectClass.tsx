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

interface SelectClassProps {
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

const AddStudent: React.FC<SelectClassProps> = ({ open, setOpen }) => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [showStudentSelection, setShowStudentSelection] =
    useState<boolean>(true);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [gradeName, setGradeName] = useState<string>("");

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

  const handleSelectClass = async () => {
    setError("");
    setMessage("");

    if (showStudentSelection && selectedClassId !== null) {
      setShowStudentSelection(false);
      return;
    }

    if (showStudentSelection && selectedClassId === null) {
      setError("Sınıf seçimi yapılmadı.");
      return;
    }

    try {
      const formattedGradeName = gradeName
        .trim()
        .toLowerCase()
        .replace(/^[a-z]/, (c: string) => c.toUpperCase());

      await instance.post(`grade/${selectedClassId}/`, {
        grade_type: formattedGradeName,
      });
      setMessage("Not eklemek için yönlendiriliyorsunuz.");
      setTimeout(() => {
        navigate("/add-grade", {
          state: { selectedClassId, formattedGradeName },
        });
        setGradeName("");
      }, 3000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message;

        switch (errorMessage) {
          case '"grade_type" is not allowed to be empty':
            setError("Not adı boş bırakılamaz.");
            break;
          case '"grade_type" length must be at least 3 characters long':
            setError("Not adı en az 3 karakter olmalıdır.");
            break;
          case '"grade_type" length must be less than or equal to 30 characters long':
            setError("Not adı en fazla 30 karakter olmalıdır.");
            break;
          case "This grade has been entered in this class before":
            setError("Bu türde not sınıf için zaten var.");
            break;
          case "There are no students in the classroom":
            setError("Bu sınıfta öğrenci yok.");
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
    setShowStudentSelection(true);
    setError("");
    setGradeName("");
    if (showStudentSelection) {
      setOpen(false);
      return;
    }
  };

  const handleKeySelectClassName = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handleSelectClass();
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
                      ? "Bir sınıf seçiniz?"
                      : "Hangi notu eklemek istediğinizi yazınız."}
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
              <div className="mx-10">
                <label
                  htmlFor="studentName"
                  className="mt-5 block text-base font-medium text-gray-900"
                >
                  Not Adı:
                </label>

                <input
                  id="studentName"
                  name="studentName"
                  type="text"
                  required
                  value={gradeName}
                  onChange={(e) => setGradeName(e.target.value)}
                  onKeyDown={handleKeySelectClassName}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-lg p-3"
                />
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

            <div className="my-5 bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-24"
                onClick={handleSelectClass}
              >
                Devam Et
              </button>
              <button
                type="button"
                data-autofocus
                onClick={cancelReturn}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 sm:mt-0 sm:w-24"
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

export default AddStudent;
