import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { isAxiosError } from "axios";

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import API from "../../api";
import { TOpenProps, TClass } from "../../types";

function SelectGrade({ open, setOpen }: TOpenProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [classes, setClasses] = useState<TClass[]>([]);
  const [showStudentSelection, setShowStudentSelection] =
    useState<boolean>(true);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [gradeName, setGradeName] = useState<string>("");
  const [gradeType, setGradeType] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      fetchClasses();
      setShowStudentSelection(true);
      setSelectedClassId(null);
      setGradeName("");
    }
  }, [open]);

  const fetchClasses = async () => {
    try {
      const classes = await API.class.allList();
      setClasses(classes.data.data);
    } catch (error: unknown) {
      console.error(error);
      if (isAxiosError(error) && error.response) {
        const errorMessage = error.response?.data?.message;
        toast.error(errorMessage || t('UNKNOWN_ERROR'));
      } else {
        toast.error((error as Error).message || t('UNKNOWN_ERROR'));
      }
    }
  };

  const handleSelectGrade = async () => {

    if (showStudentSelection && selectedClassId !== null) {
      setShowStudentSelection(false);

      try {
        const notesInClass = await API.grade.classFindAll(selectedClassId);

        const uniqueGradeTypes = Array.from(
          new Set(
            (notesInClass.data.data as unknown as { gradeType: string }[]).map(
              (note) => note.gradeType
            )
          )
        );
        if (uniqueGradeTypes.length === 0) {
          toast.error(t("THERE_ARE_NO_NOTES_CLASS"));
          return;
        }
        setGradeType(uniqueGradeTypes);
      } catch (error: unknown) {
        console.error(error);
        if (isAxiosError(error) && error.response) {
          const errorMessage = error.response?.data?.message;
          toast.error(errorMessage || t('UNKNOWN_ERROR'));
        } else {
          toast.error((error as Error).message || t('UNKNOWN_ERROR'));
        }
      }

      return;
    }

    if (showStudentSelection && selectedClassId === null) {
      toast.error(t("CLASS_SELECTION_NOT_MADE"));
      return;
    }

    if (gradeName !== "") {
      toast.success(t("BEING_DIRECTED_TO_UPDATE_YOUR_NOTE"));
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
    setGradeName("");
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
            className="relative transform overflow-hidden rounded-md bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:p-12 sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white p-5">
              <div className="sm:flex sm:items-start">
                <div className="text-left mx-auto">
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
              <div className="grid sm:grid-cols-3 grid-cols-2 gap-5">
                {classes.map((classItem, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`mx-auto m-4 inline-flex w-24 py-2 justify-center rounded-md text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 focus:bg-gray-200 active:bg-gray-100 transition-all ${selectedClassId === classItem.id
                      ? "bg-gray-200"
                      : "bg-white"
                      }`}
                    onClick={() => classItem.id !== undefined && setSelectedClassId(classItem.id)}
                  >
                    {classItem.className}
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
