import React, { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import axios from "axios";

import instance from "../services/axiosInstance";

interface UpdateClassDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: number;
  className: string;
  explanation: string;
  onUpdate: () => void; // Geri çağırma fonksiyonu
}

const UpdateClassDialog: React.FC<UpdateClassDialogProps> = ({
  open,
  setOpen,
  id,
  className,
  explanation,
  onUpdate,
}) => {
  const [newClassName, setNewClassName] = useState<string>(className);
  const [newExplanation, setNewExplanation] = useState<string>(explanation);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleUpdateClass = async () => {
    setError(null);
    setMessage(null);

    const updateFields: { class_name?: string; explanation?: string } = {};

    if (newClassName !== className) {
      updateFields.class_name = newClassName;
    }

    if (newExplanation !== explanation) {
      updateFields.explanation = newExplanation;
    }

    if (Object.keys(updateFields).length === 0) {
      setError("Değişiklik yapılmadı.");
      return;
    }

    try {
      await instance.patch(`class/${id}`, updateFields);
      setMessage("Sınıf bilgileri başarıyla güncellendi.");
      setTimeout(() => {
        setMessage(null);
        setOpen(false);
        onUpdate(); // Sınıf adı güncellendikten sonra geri çağırma fonksiyonunu çağır
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
          case "Invalid class id":
            setError("Geçersiz sınıf.");
            break;
          case "The teacher does not have such a class":
            setError("Böyle bir sınıfınız yok.");
            break;
          default:
            setError("Bir hata oluştu. Lütfen tekrar deneyin.");
        }
        return;
      }
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
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

            {error && (
              <p className="text-center text-base text-red-600">{error}</p>
            )}
            {message && (
              <p className="text-center text-base text-green-600">{message}</p>
            )}

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
