import React, { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

import instance from "../services/axiosInstance";

interface AddClassProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAdd: () => void;
}

const AddClass: React.FC<AddClassProps> = ({ open, setOpen, onAdd }) => {
  const [className, setClassName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [explanation, setExplanation] = useState("");

  const addClass = async () => {
    setError("");
    setMessage("");

    try {
      await instance.post("class", { class_name: className, explanation });

      setMessage("Sınıfınız başarıyla eklendi.");
      setTimeout(() => {
        setClassName("");
        setExplanation("");
        setMessage("");
        onAdd();
      }, 3000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message;

        switch (errorMessage) {
          case "Class name is already used":
            setError("Sınıf adı zaten kullanılmış.");
            break;
          case '"class_name" length must be at least 2 characters long':
            setError("Sınıf adı en az 2 karakter olmalıdır.");
            break;
          case '"class_name" length must be less than or equal to 3 characters long':
            setError("Sınıf adı en fazla 3 karakter olmalıdır.");
            break;
          case '"class_name" is required':
            setError("Sınıf adı boş bırakılamaz.");
            break;
          case '"explanation" is required':
            setError("Açıklama gereklidir.");
            break;
          case '"explanation" is not allowed to be empty':
            setError("Açıklama boş bırakılamaz.");
            break;
          default:
            setError("Bir hata oluştu. Lütfen tekrar deneyin.");
        }
        return;
      }
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
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
    setError("");
    setMessage("");
  };

  return (
    <Dialog open={open} onClose={handleOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center text-center items-center">
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
                  {error && <p className="text-base text-red-600">{error}</p>}
                  {message && (
                    <p className="text-base text-green-600">{message}</p>
                  )}
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
