import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
import { TAddProps, TClass } from "../../types";

function AddDialog({ open, setOpen, onAdd }: TAddProps) {
  const { t } = useTranslation();
  const location = useLocation();

  const [classes, setClasses] = useState<TClass[]>([]);
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [number, setNumber] = useState<number>();
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [idNumber, setIdNumber] = useState<string>();
  const [birthday, setBirthday] = useState<Date>();
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
    setFirstname("");
    setLastname("");
    setNumber(undefined);
    setGender("");
    setBirthday(undefined);
    setSelectedClassId(null);
  };

  const handleAddStudent = async () => {

    if (selectedClassId === null) {
      toast.error(t('CLASS_SELECTION_WAS_NOT_MADE'));
      return;
    }
    try {
      const response = await API.student.add({
        classId: selectedClassId,
        idNumber: idNumber ? idNumber.toString() : "0",
        firstname,
        lastname,
        number: number ?? 0,
        gender,
        birthday: birthday ?? null,
      });
      toast.success(response.data.message);
      setTimeout(() => {
        resetForm();
        onAdd();
        if (location.pathname.includes('student')) {
          setOpen(false);
        }
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

  useEffect(() => {
    if (gender === "Erkek") {
      setGender("Male");
    }

    if (gender === "Kız") {
      setGender("Female");
    }
  }, [gender]);

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
        <div className="flex min-h-full justify-center items-center">
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
                    {t('ADD_STUDENT')}
                  </DialogTitle>
                </div>
              </div>

              <div className="mt-3 mx-6">
                <div className="block text-lg font-medium text-gray-900">
                  {t('SELECT_CLASS')}:
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
                      {classItem.className}
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
                    {t('TR_IDENTITY_NUMBER')}:
                  </label>

                  <input
                    id="studentTc"
                    name="studentTc"
                    type="text"
                    required
                    value={idNumber?.toString() || ""}
                    onChange={(e) => setIdNumber(e.target.value)}
                    onKeyDown={handleKeyAddStudent}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 text-base p-3 disabled:opacity-75"
                    disabled={isDisabled}
                  />
                </div>

                <div>
                  <label
                    htmlFor="firstname"
                    className="mt-5 block text-lg font-medium text-gray-900"
                  >
                    {t('FIRSTNAME')}:
                  </label>

                  <input
                    id="firstname"
                    name="firstname"
                    type="text"
                    required
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    onKeyDown={handleKeyAddStudent}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 text-base p-3 disabled:opacity-75"
                    disabled={isDisabled}
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastname"
                    className="mt-5 block text-lg font-medium text-gray-900"
                  >
                    {t('LASTNAME')}:
                  </label>

                  <input
                    id="lastname"
                    name="lastname"
                    type="text"
                    required
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    onKeyDown={handleKeyAddStudent}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 text-base p-3 disabled:opacity-75"
                    disabled={isDisabled}
                  />
                </div>

                <div>
                  <label
                    htmlFor="number"
                    className="mt-5 block text-lg font-medium text-gray-900"
                  >
                    {t('NUMBER')}:
                  </label>

                  <input
                    id="number"
                    name="number"
                    type="text"
                    required
                    value={number}
                    onChange={(e) => setNumber(Number(e.target.value))}
                    onKeyDown={handleKeyAddStudent}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 text-base p-3 disabled:opacity-75"
                    disabled={isDisabled}
                  />
                </div>

                <div>
                  <div className="mt-5 block text-lg font-medium text-gray-900">
                    {t("GENDER")}:
                  </div>

                  <div className="grid grid-cols-2">
                    <button
                      type="button"
                      className={`my-5 mx-auto inline-flex justify-center rounded-md py-2 text-base font-semibold shadow-sm w-24 ring-1 ring-inset ring-gray-300 transition-all text-gray-900 hover:bg-slate-50 focus:bg-slate-200  active:bg-slate-100 disabled:opacity-75 disabled:hover:bg-white ${gender === t("FEMALE") ? "bg-slate-200" : "bg-white"
                        }`}
                      onClick={() => setGender(t("FEMALE"))}
                      disabled={isDisabled}
                    >
                      {t("FEMALE")}
                    </button>
                    <button
                      type="button"
                      className={`my-5 mx-auto inline-flex justify-center rounded-md py-2 text-base font-semibold shadow-sm w-24 ring-1 ring-inset ring-gray-300 transition-all text-gray-900 hover:bg-slate-50 focus:bg-slate-200  active:bg-slate-100 disabled:opacity-75 disabled:hover:bg-white ${gender === t("MALE") ? "bg-slate-200" : "bg-white"
                        }`}
                      onClick={() => setGender(t("MALE"))}
                      disabled={isDisabled}
                    >
                      {t("MALE")}
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2">
                  <label
                    htmlFor="datePicker"
                    className="block text-lg font-medium text-gray-900"
                  >
                    {t("BIRTHDAY")}:
                  </label>

                  <input
                    type="date"
                    required={true}
                    id="birthday"
                    name="birthday"
                    value={birthday ? birthday.toISOString().split('T')[0] : ""}
                    placeholder="Doğum Tarihi Seçiniz"
                    className="text-base disabled:opacity-75"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setBirthday(new Date(e.target.value));
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
                {t('ADD')}
              </button>
              <button
                type="button"
                data-autofocus
                onClick={cancelReturn}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white py-2 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-24  transition-all"
              >
                {t('CANCEL')}
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default AddDialog;
