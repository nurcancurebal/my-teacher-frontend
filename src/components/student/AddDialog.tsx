import React, { useEffect, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
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
import { TAddProps, TClass, TDateValueType } from "../../types";

function AddStudent({ open, setOpen, onAdd }: TAddProps) {
  const { t } = useTranslation();

  const [classes, setClasses] = useState<TClass[]>([]);
  const [studentName, setStudentName] = useState<string>("");
  const [studentLastname, setStudentLastName] = useState<string>("");
  const [studentNumber, setStudentNumber] = useState<number>();
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [idNumber, setIdNumber] = useState<bigint>();
  const [date, setDate] = useState<TDateValueType>({
    startDate: null,
    endDate: null,
  });
  const [gender, setGender] = useState<string>("");

  const isDisabled = classes.length === 0;

  useEffect(() => {
    if (open) {
      fetchClasses();
      resetForm();
    }
  }, [open]);

  const fetchClasses = async () => {
    try {
      const response = await API.class.allList();
      const classes = response.data.data;
      if (classes.length > 0) {
        setClasses(classes);
      } else {
        toast.error(t('CLASS_NOT_FOUND_ADD_CLASS_FIRST'));
      }
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

  const resetForm = () => {
    setIdNumber(undefined);
    setStudentName("");
    setStudentLastName("");
    setStudentNumber(undefined);
    setGender("");
    setDate({ startDate: null, endDate: null });
    setSelectedClassId(null);
  };

  const handleAddStudent = async () => {

    if (selectedClassId === null) {
      toast.error(t('CLASS_SELECTION_WAS_NOT_MADE'));
      return;
    }

    try {
      const response = await API.student.add({
        class_id: selectedClassId,
        id_number: idNumber ?? BigInt(0),
        student_name: studentName,
        student_lastname: studentLastname,
        student_number: studentNumber ?? 0,
        gender,
        birthdate: date.startDate,
      });
      toast.success(response.data.message);
      setTimeout(() => {
        resetForm();
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

  const cancelReturn = () => {
    setOpen(false);
  };

  const handleKeyAddStudent = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleAddStudent();
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
        <div className="flex min-h-full items-end justify-center items-center">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-md bg-white shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:p-5 sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95x"
          >
            <div className="p-5">
              <div className="sm:flex sm:items-start mb-5">
                <div className="mt-3 sm:mt-0 mx-auto">
                  <DialogTitle
                    as="h3"
                    className="text-2xl font-semibold text-gray-900"
                  >
                    Öğrenci Ekle
                  </DialogTitle>
                </div>
              </div>

              <div className="mt-3 mx-6">
                <div className="block text-lg font-medium text-gray-900">
                  Sınıf Seçiniz:
                </div>
                <div className="grid sm:grid-cols-3 grid-cols-2 gap-5">
                  {classes.map((classItem, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`mx-auto m-2 inline-flex justify-center rounded-md py-2 text-base font-semibold shadow-sm w-24 ring-1 ring-inset ring-gray-300 transition-all text-gray-900 hover:bg-gray-100 focus:bg-gray-200 active:bg-gray-100 ${selectedClassId === classItem.id
                        ? "bg-gray-200"
                        : "bg-white"
                        }`}
                      onClick={() => classItem.id !== undefined && setSelectedClassId(classItem.id)}
                    >
                      {classItem.class_name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="m-6">
                <div>
                  <label
                    htmlFor="studentTc"
                    className="mt-5 block text-lg font-medium text-gray-900"
                  >
                    Öğrenci TC:
                  </label>

                  <input
                    id="studentTc"
                    name="studentTc"
                    type="text"
                    required
                    value={idNumber?.toString() || ""}
                    onChange={(e) => setIdNumber(BigInt(e.target.value))}
                    onKeyDown={handleKeyAddStudent}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 text-base p-3 disabled:opacity-75"
                    disabled={isDisabled}
                  />
                </div>

                <div>
                  <label
                    htmlFor="studentName"
                    className="mt-5 block text-lg font-medium text-gray-900"
                  >
                    Öğrenci Adı:
                  </label>

                  <input
                    id="studentName"
                    name="studentName"
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    onKeyDown={handleKeyAddStudent}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 text-base p-3 disabled:opacity-75"
                    disabled={isDisabled}
                  />
                </div>

                <div>
                  <label
                    htmlFor="studentLastname"
                    className="mt-5 block text-lg font-medium text-gray-900"
                  >
                    Öğrenci Soyadı:
                  </label>

                  <input
                    id="studentLastname"
                    name="studentLastname"
                    type="text"
                    required
                    value={studentLastname}
                    onChange={(e) => setStudentLastName(e.target.value)}
                    onKeyDown={handleKeyAddStudent}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 text-base p-3 disabled:opacity-75"
                    disabled={isDisabled}
                  />
                </div>

                <div>
                  <label
                    htmlFor="studentNumber"
                    className="mt-5 block text-lg font-medium text-gray-900"
                  >
                    Öğrenci Numarası:
                  </label>

                  <input
                    id="studentNumber"
                    name="studentNumber"
                    type="text"
                    required
                    value={studentNumber}
                    onChange={(e) => setStudentNumber(Number(e.target.value))}
                    onKeyDown={handleKeyAddStudent}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 text-base p-3 disabled:opacity-75"
                    disabled={isDisabled}
                  />
                </div>

                <div>
                  <div className="mt-5 block text-lg font-medium text-gray-900">
                    Öğrenci Cinsiyeti:
                  </div>

                  <div className="grid grid-cols-2">
                    <button
                      type="button"
                      className={`my-5 mx-auto inline-flex justify-center rounded-md py-2 text-base font-semibold shadow-sm w-24 ring-1 ring-inset ring-gray-300 transition-all text-gray-900 hover:bg-slate-50 focus:bg-slate-200  active:bg-slate-100 disabled:opacity-75 disabled:hover:bg-white ${gender === "K" ? "bg-slate-200" : "bg-white"
                        }`}
                      onClick={() => setGender("K")}
                      disabled={isDisabled}
                    >
                      Kız
                    </button>
                    <button
                      type="button"
                      className={`my-5 mx-auto inline-flex justify-center rounded-md py-2 text-base font-semibold shadow-sm w-24 ring-1 ring-inset ring-gray-300 transition-all text-gray-900 hover:bg-slate-50 focus:bg-slate-200  active:bg-slate-100 disabled:opacity-75 disabled:hover:bg-white ${gender === "E" ? "bg-slate-200" : "bg-white"
                        }`}
                      onClick={() => setGender("E")}
                      disabled={isDisabled}
                    >
                      Erkek
                    </button>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="datePicker"
                    className="mt-5 block text-lg font-medium text-gray-900"
                  >
                    Doğum Tarihi:
                  </label>

                  <Datepicker
                    useRange={false}
                    asSingle={true}
                    required={true}
                    inputId="datePicker"
                    inputName="datePicker"
                    value={date}
                    placeholder="Doğum Tarihi Seçiniz"
                    displayFormat="DD.MM.YYYY"
                    inputClassName="text-base  disabled:opacity-75"
                    onChange={(newDate: TDateValueType | null) => {
                      if (newDate) {
                        setDate(newDate);
                      }
                    }}
                    disabled={isDisabled}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-5 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-green-600 py-2 text-base font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-24 transition-all disabled:opacity-75 disabled:hover:bg-green-600"
                onClick={handleAddStudent}
                disabled={isDisabled}
              >
                Ekle
              </button>
              <button
                type="button"
                data-autofocus
                onClick={cancelReturn}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white py-2 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-24  transition-all"
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

export default AddStudent;
