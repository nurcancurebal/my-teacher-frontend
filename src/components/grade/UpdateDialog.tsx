import { useState, useEffect } from "react";
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
import { TGradeUpdateProps } from "../../types";

function UpdateDialog({ open, setOpen, grade, fetchData }: TGradeUpdateProps) {
  const { t } = useTranslation();

  const [gradeType, setGradeType] = useState<string>("");
  const [oldGradeType, setOldGradeType] = useState<string>("");

  useEffect(() => {
    if (grade) {
      setGradeType(grade.gradeType);
      setOldGradeType(grade.gradeType);
    }
  }, [grade]);


  const fetchGradeTypeData = async () => {
    try {
      const response = await API.grade.allGradeType(oldGradeType);

      for (const grade of response.data.data) {
        const { classId, studentId, id, gradeValue } = grade;
        const bodyData = { gradeType: gradeType, gradeValue };
        await API.grade.update({ classId, studentId, id, ...bodyData });
      }

      toast.success(t('GRADE_TYPE_UPDATED'));
      setTimeout(() => {
        setGradeType("");
        fetchData();
        setOpen(false);
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
  }

  return (
    <Dialog
      open={open}
      onClose={setOpen}
      className="relative z-10"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full justify-center p-4 text-center items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-md bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:p-12 sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 p-5"
          >
            <div className="p-5">
              <div className="bg-white">
                <div className="sm:flex sm:items-start">
                  <div className="text-left mx-auto">
                    <DialogTitle
                      as="h3"
                      className="text-2xl font-semibold text-gray-900"
                    >
                      {t("UPDATE_GRADE_TYPE")}
                    </DialogTitle>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="firstname"
                  className="mt-5 block text-lg font-medium text-gray-900"
                >
                  {t('FIRSTNAME')}
                </label>

                <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  required
                  value={gradeType}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 text-base p-3"
                  onChange={(e) => setGradeType(e.target.value)}
                />
              </div>
            </div>

            <div className="p-5 bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-green-600 py-2 text-base font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-24"
                onClick={() => gradeType !== oldGradeType && fetchGradeTypeData()}
              >
                {t("UPDATE")}
              </button>
              <button
                type="button"
                data-autofocus
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white py-2 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-24"
              >
                {t("CANCEL")}
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default UpdateDialog;
