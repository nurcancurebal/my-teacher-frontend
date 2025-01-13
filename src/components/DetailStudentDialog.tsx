import React from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

interface Student {
  id: number;
  class_id: number;
  teacher_id: number;
  tc: bigint;
  student_name: string;
  student_lastname: string;
  student_number: number;
  gender: string;
  birthdate: Date;
}

interface ViewDetailDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  student: Student;
}

const ViewDetailDialog: React.FC<ViewDetailDialogProps> = ({
  open,
  setOpen,
  student,
}) => {
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
        <div className="flex min-h-full items-end justify-center p-4 text-center items-center sm:p-0">
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
                  Öğrenci Bilgileri
                </DialogTitle>
              </div>

              <div className="sm:mx-0 mx-4 pb-5">
                <span className="text-lg font-medium">TC Kimlik Numarası:</span>
                <span className="text-base ml-3">{student.tc.toString()}</span>
              </div>

              <div className="sm:mx-0 mx-4 pb-5">
                <span className="text-lg font-medium">Adı Soyadı:</span>
                <span className="text-base ml-3">
                  {student.student_name} {student.student_lastname}
                </span>
              </div>

              <div className="sm:mx-0 mx-4 pb-5">
                <span className="text-lg font-medium">Öğrenci Numarası:</span>
                <span className="text-base ml-3">{student.student_number}</span>
              </div>

              <div className="sm:mx-0 mx-4 pb-5">
                <span className="text-lg font-medium">Cinsiyeti:</span>
                <span className="text-base ml-3">
                  {student.gender === "K" ? "Kadın" : "Erkek"}
                </span>
              </div>

              <div className="sm:mx-0 mx-4">
                <span className="text-lg font-medium">Doğum Tarihi:</span>
                <span className="text-base ml-3">
                  {new Date(student.birthdate).toLocaleDateString()}
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
                Kapat
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ViewDetailDialog;
