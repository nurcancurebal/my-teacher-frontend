import { useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

import { useTranslation } from 'react-i18next';

import { TGradeUpdateProps } from "../../types";

function UpdateDialog({ open, setOpen, grade, setNewGradeType }: TGradeUpdateProps) {
  const { t } = useTranslation();

  const [gradeType, setGradeType] = useState<string>("");

  useEffect(() => {
    if (grade) {
      setGradeType(grade.gradeType);
    }
  }, [grade]);

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
                  {t('NAME')}:
                </label>

                <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  required
                  value={gradeType}
                  onChange={(e) => setGradeType(e.target.value)}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 text-base p-3"
                />
              </div>
            </div>

            <div className="p-5 bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-green-600 py-2 text-base font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-24"
                onClick={() => setNewGradeType(gradeType)}
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
