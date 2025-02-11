import React, { useEffect, useState } from "react";
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

function AddStudent({ open, setOpen }: TOpenProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [classes, setClasses] = useState<TClass[]>([]);
  const [showStudentSelection, setShowStudentSelection] =
    useState<boolean>(true);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [gradeName, setGradeName] = useState<string>("");

  const isDisabled = classes.length === 0;

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
      const response = await API.class.allList();
      const classes = response.data.data;
      if (classes.length > 0) {
        setClasses(classes);

      } else {
        toast.error(t("CLASS_NOT_FOUND_ADD_CLASS_FIRST"));
      }
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

  const handleSelectClass = async () => {
    if (showStudentSelection && selectedClassId !== null) {
      try {
        const response = await API.student.getListByClass(selectedClassId);
        const students = response.data.data;
        if (students.length === 0) {
          toast.error(t("NO_STUDENTS_FOUND_CLASS"));
          return;
        }
        setShowStudentSelection(false);
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
      toast.error(t("CLASS_SELECTION_WAS_NOT_MADE"));
      return;
    }

    try {
      const formattedGradeName = gradeName
        .trim()
        .toLowerCase()
        .replace(/^[a-z]/, (c: string) => c.toUpperCase());
      if (selectedClassId !== null) {
        const response = await API.grade.gradeTypeExists({ classId: selectedClassId, gradeType: formattedGradeName });
        toast.success(response.data.message);
      } else {
        toast.error(t("CLASS_SELECTION_WAS_NOT_MADE"));
        return;
      }

      setTimeout(() => {
        navigate("/add-grade", {
          state: { selectedClassId, formattedGradeName },
        });
        setGradeName("");
      }, 3000);
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

  const cancelReturn = () => {
    setShowStudentSelection(true);
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
        <div className="flex min-h-full justify-center text-center items-center">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-md bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 p-5 sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="p-5">
              <div className="sm:flex sm:items-start pb-5">
                <div className="text-left mx-auto">
                  <DialogTitle
                    as="h3"
                    className="text-2xl font-semibold text-gray-900"
                  >
                    {showStudentSelection
                      ? t("SELECT_A_CLASS")
                      : t("WRITE_WHICH_NOTE_YOU_WANT_TO_ADD")}
                  </DialogTitle>
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
                      onClick={() => {
                        if (classItem.id !== undefined) {
                          setSelectedClassId(classItem.id);
                        }
                      }}
                    >
                      {classItem.className}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mx-10">
                  <label
                    htmlFor="studentName"
                    className="block text-lg font-medium text-gray-900"
                  >
                    {t("NOTE_TITLE")}:
                  </label>

                  <input
                    id="studentName"
                    name="studentName"
                    type="text"
                    required
                    value={gradeName}
                    onChange={(e) => setGradeName(e.target.value)}
                    onKeyDown={handleKeySelectClassName}
                    className="mt-5 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 text-base p-3"
                  />
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-5 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-green-600 py-2 text-base font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-24 disabled:opacity-75 disabled:hover:bg-green-600"
                onClick={handleSelectClass}
                disabled={isDisabled}
              >
                {t("CONTINUE")}
              </button>
              <button
                type="button"
                data-autofocus
                onClick={cancelReturn}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white py-2 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-24"
              >
                {showStudentSelection ? t("CANCEL") : t("GO_BACK")}
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default AddStudent;
