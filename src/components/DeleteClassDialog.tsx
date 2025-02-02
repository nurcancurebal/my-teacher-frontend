import React, { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

import instance from "../services/axiosInstance";

interface DeleteClassDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: number;
  className: string;
  onDelete: () => void; // Geri çağırma fonksiyonu
}

const DeleteClassDialog: React.FC<DeleteClassDialogProps> = ({
  open,
  setOpen,
  id,
  className,
  onDelete,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleDeleteClass = async () => {
    setError(null);
    setMessage(null);

    try {
      await instance.delete(`class/${id}`);
      setMessage("Sınıf başarıyla silindi.");
      setTimeout(() => {
        setMessage(null);
        setOpen(false);
        onDelete(); // Sınıf silindikten sonra geri çağırma fonksiyonunu çağır
      }, 3000);
    } catch (error) {
      setError("Sınıf silinirken bir hata oluştu.");
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
        <div className="flex min-h-full items-end justify-center p-4 text-left items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-md bg-white shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 p-5 sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white p-5">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 sm:ml-4 sm:mt-0">
                  <DialogTitle
                    as="h3"
                    className="text-2xl font-semibold text-gray-900"
                  >
                    <span className="text-red-500">"{className}"</span> Sınıfını
                    silmek istediğinize emin misiniz?
                  </DialogTitle>
                </div>
              </div>
            </div>

            {error && (
              <p className="text-center text-base text-red-600">{error}</p>
            )}
            {message && (
              <p className="text-center text-base text-green-600">{message}</p>
            )}

            <div className="bg-gray-50 p-5 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-24"
                onClick={handleDeleteClass}
              >
                Sil
              </button>
              <button
                type="button"
                data-autofocus
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 sm:mt-0 sm:w-24"
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

export default DeleteClassDialog;
