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
import { TDeleteStudentDialogProps } from "../../types";

function DeleteStudentDialog({
  open,
  setOpen,
  id,
  studentName,
  studentLastName,
  onDelete,
}: TDeleteStudentDialogProps) {
  const { t } = useTranslation();

  const handleDeleteStudent = async () => {

    try {
      const response = await API.student.delete(id);
      toast.success(response.data.message);
      setTimeout(() => {
        setOpen(false);
        onDelete();
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

  const onClose = () => {
    setOpen(false);
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
        <div className="flex min-h-full justify-center text-left items-center">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-md bg-white shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 p-5 sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white p-5">
              <div className="sm:flex sm:items-start">
                <DialogTitle
                  as="h3"
                  className="text-2xl font-semibold text-gray-900"
                >
                  <span className="text-red-500">
                    "{studentName} {studentLastName}"
                  </span>{" "}
                  {t("STUDENT_ARE_YOU_SURE_DELETE")}
                </DialogTitle>
              </div>
            </div>

            <div className="bg-gray-50 sm:flex sm:flex-row-reverse p-5">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-24"
                onClick={handleDeleteStudent}
              >
                {t("DELETE")}
              </button>
              <button
                type="button"
                data-autofocus
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 sm:mt-0 sm:w-24"
                onClick={onClose}
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

export default DeleteStudentDialog;
