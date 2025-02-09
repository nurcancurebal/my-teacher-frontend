import React, { useState } from "react";
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
import { TUpdateClassDialogProps } from "../../types";

function UpdateClassDialog({
  open,
  setOpen,
  id,
  className,
  explanation,
  onUpdate,
}: TUpdateClassDialogProps) {
  const { t } = useTranslation();

  const [newClassName, setNewClassName] = useState<string>(className);
  const [newExplanation, setNewExplanation] = useState<string>(explanation);

  const handleUpdateClass = async () => {

    try {
      const response = await API.class.update({ id, class_name: newClassName, explanation: newExplanation });

      toast.success(response.data.message);

      setTimeout(() => {
        setOpen(false);
        onUpdate();
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

  const enterKeyHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleUpdateClass();
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
        <div className="flex min-h-full items-end justify-center text-center items-center">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-md bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in p-5 sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="p-5">
              <div className="bg-white pb-5">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle
                      as="h3"
                      className="text-2xl font-semibold text-gray-900"
                    >
                      Sınıf Bilgilerini Güncelle
                    </DialogTitle>
                  </div>
                </div>
              </div>

              <div className="sm:mx-0 mx-4">
                <label
                  htmlFor="className"
                  className="block text-base font-medium text-gray-900"
                >
                  Sınıf Adı:
                </label>
                <input
                  id="className"
                  name="className"
                  type="text"
                  required
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 text-base p-3"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  onKeyDown={enterKeyHandler}
                />
              </div>

              <div className="sm:mx-0 mx-4">
                <label
                  htmlFor="explanation"
                  className="mt-5 block text-lg font-medium text-gray-900"
                >
                  Açıklama:
                </label>
                <textarea
                  id="explanation"
                  name="explanation"
                  required
                  className="row-5 mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 text-base p-3"
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                />
              </div>
            </div>

            <div className="p-5 bg-gray-50 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-green-600 py-2 text-base font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-24"
                onClick={handleUpdateClass}
              >
                Güncelle
              </button>
              <button
                type="button"
                data-autofocus
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white py-2 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-24"
                onClick={onClose}
              >
                İptal Et
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default UpdateClassDialog;
