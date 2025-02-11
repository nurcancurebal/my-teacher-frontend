import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useTranslation } from 'react-i18next';

import { TViewDetailDialogProps } from "../../types";

function ViewDetailDialog({
  open,
  setOpen,
  student,
}: TViewDetailDialogProps) {
  const { t } = useTranslation();

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
        <div className="flex min-h-full justify-center p-4 text-center items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-md bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 p-5 sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="p-5">
              <div className="sm:flex sm:items-start pb-5">
                <DialogTitle
                  as="h3"
                  className="text-2xl font-semibold text-gray-900 mx-auto"
                >
                  {t("STUDENT_INFORMATION")}
                </DialogTitle>
              </div>

              <div className="sm:mx-0 mx-4 pb-5">
                <span className="text-lg font-medium">{t("TR_IDENTITY_NUMBER")}:</span>
                <span className="text-base ml-3">{student.idNumber.toString()}</span>
              </div>

              <div className="sm:mx-0 mx-4 pb-5">
                <span className="text-lg font-medium">{t("NAME") + " " + t("LASTNAME")} :</span>
                <span className="text-base ml-3">
                  {student.studentName} {student.studentLastname}
                </span>
              </div>

              <div className="sm:mx-0 mx-4 pb-5">
                <span className="text-lg font-medium">{t("STUDENT_NUMBER")}:</span>
                <span className="text-base ml-3">{student.studentNumber}</span>
              </div>

              <div className="sm:mx-0 mx-4 pb-5">
                <span className="text-lg font-medium">{t("GENDER")}:</span>
                <span className="text-base ml-3">
                  {student.gender === t("MALE") ? t("MALE") : t("FEMALE")}
                </span>
              </div>

              <div className="sm:mx-0 mx-4">
                <span className="text-lg font-medium">{t("BIRTHDATE")}:</span>
                <span className="text-base ml-3">
                  {student.birthdate ? new Date(student.birthdate).toLocaleDateString() : "N/A"}
                </span>
              </div>
            </div>
            <div className="bg-gray-50 p-5 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                data-autofocus
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white py-2 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-24"
                onClick={() => setOpen(false)}
              >
                {t("CLOSE")}
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ViewDetailDialog;
