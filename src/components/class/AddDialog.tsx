import React, { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { isAxiosError } from "axios";

import { useTranslation } from 'react-i18next';
import { toast } from "react-toastify";

import API from "../../api";
import { TAddProps } from "../../types";

function AddClass({ open, setOpen, onAdd }: TAddProps) {
  const { t } = useTranslation();

  const [className, setClassName] = useState("");
  const [explanation, setExplanation] = useState("");

  const addClass = async () => {

    try {

      const response = await API.class.add({ className, explanation });

      toast.success(response.data.message);

      setTimeout(() => {
        setClassName("");
        setExplanation("");
        onAdd();
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      addClass();
    }
  };

  const handleOpen = () => {
    setOpen(false);
    setClassName("");
    setExplanation("");
  };

  return (
    <Dialog open={open} onClose={handleOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full justify-center text-center items-center">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-md bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:p-5 sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white p-5">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 sm:ml-4 sm:mt-0 text-left">
                  <DialogTitle
                    as="h3"
                    className="text-2xl text-center font-semibold text-gray-900 mb-5"
                  >
                    Sınıf Ekle
                  </DialogTitle>
                  <div>
                    <label
                      htmlFor="className"
                      className="block text-lg font-medium text-gray-900"
                    >
                      Sınıf Adı:
                    </label>
                    <input
                      id="className"
                      name="className"
                      type="text"
                      required
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 text-base mt-3"
                      onKeyDown={handleKeyDown}
                    />
                  </div>

                  <div>
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
                      className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 text-base mt-3"
                      value={explanation}
                      onChange={(e) => setExplanation(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-5 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={addClass}
                className="inline-flex w-full justify-center rounded-md bg-green-600 py-2 text-base font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-24"
              >
                Ekle
              </button>
              <button
                type="button"
                data-autofocus
                onClick={handleOpen}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white py-2 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-24"
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

export default AddClass;
