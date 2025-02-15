import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import API from "../../api";
import { TClassGradeTypeDialogProps, TGradeType } from "../../types";

function ClassGradeTypeDialog({ open, setOpen, classId, className }: TClassGradeTypeDialogProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [grade, setGrade] = useState<TGradeType[] | null>(null);
  const [selectedGradeType, setSelectedGradType] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await API.grade.allUniqueGradeTypeByClass(classId);

      if (response.data.data.length === 0) {
        toast.error(t('NO_GRADE_TYPE'));
        setOpen(false);
        return;
      }
      setGrade(response.data.data);
      setSelectedGradType(null);

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

  useEffect(() => {
    fetchData();
  }, [open]);

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
                    {t("SELECT_GRADE_TYPE")}
                  </DialogTitle>
                </div>
              </div>


              <div className="grid sm:grid-cols-3 grid-cols-2 gap-5">
                {grade?.map((g) => (
                  <button
                    key={g.gradeType}
                    type="button"
                    className={`mx-auto m-4 inline-flex w-24 py-2 justify-center rounded-md text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 focus:bg-gray-200 active:bg-gray-100 transition-all items-center  ${selectedGradeType === g.gradeType
                      ? "bg-gray-200"
                      : "bg-white"
                      }`}
                    onClick={() => setSelectedGradType(g.gradeType)}
                  >
                    {g.gradeType}
                  </button>
                ))}


              </div>
            </div>

            <div className="bg-gray-50 p-5 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-green-600 py-2 text-base font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-24 disabled:opacity-75 disabled:hover:bg-green-600"
                onClick={() => { navigate("/class-notes", { state: { gradeType: selectedGradeType, classId, className } }); }}
              >
                {t("CONTINUE")}
              </button>
              <button
                type="button"
                data-autofocus
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white py-2 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-24"
                onClick={() => setOpen(false)}
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

export default ClassGradeTypeDialog;
