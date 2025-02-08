import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import Datepicker from "react-tailwindcss-datepicker";

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { isAxiosError } from "axios";

import API from "../../api";

import { TUpdateStudentDialogProps, TDateValueType, TClass } from "../../types";

function UpdateStudentDialog({
  open,
  setOpen,
  student,
  onUpdate,
}: TUpdateStudentDialogProps) {
  const { t } = useTranslation();

  const [idNumber, setIdNumber] = useState<bigint>(student.id_number);
  const [studentName, setStudentName] = useState<string>(student.student_name);
  const [studentLastname, setStudentLastName] = useState<string>(
    student.student_lastname
  );
  const [studentNumber, setStudentNumber] = useState<number>(
    student.student_number
  );
  const [gender, setGender] = useState<string>(student.gender);
  const [date, setDate] = useState<TDateValueType>({
    startDate: student.birthdate,
    endDate: student.birthdate,
  });
  const [classId, setClassId] = useState<number>(student.class_id);
  const [classes, setClasses] = useState<TClass[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classes = await API.class.allList();
        setClasses(classes.data.data);
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
    fetchClasses();
  }, []);

  const handleUpdateStudent = async () => {
    setError(null);
    setMessage(null);


    try {
      await API.student.update({ id: student.id, class_id: classId, id_number: idNumber, student_name: studentName, student_lastname: studentLastname, student_number: studentNumber, gender, birthdate: date.startDate });
      setMessage("Öğrenci başarıyla güncellendi.");

      setTimeout(() => {
        setOpen(false);
        setMessage(null);
        setError(null);
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

  const enterKeyHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleUpdateStudent();
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
        <div className="flex min-h-full items-end justify-center text-center items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-md bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 p-5 sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="p-5">
              <div className="bg-white pb-5">
                <div className="sm:flex sm:items-start">
                  <DialogTitle
                    as="h3"
                    className="text-2xl font-semibold text-gray-900 mx-auto"
                  >
                    Öğrenci Bilgilerini Güncelle
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
                      className={`mx-auto m-2 inline-flex justify-center rounded-md py-2 text-base font-semibold shadow-sm w-24 ring-1 ring-inset ring-gray-300 transition-all text-gray-900 hover:bg-gray-100 focus:bg-gray-200 active:bg-gray-100 ${classId === classItem.id ? "bg-gray-200" : "bg-white"
                        }`}
                      onClick={() => classItem.id !== undefined && setClassId(classItem.id)}
                    >
                      {classItem.class_name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mx-5 mt-5">
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
                    value={idNumber.toString()}
                    onChange={(e) => setIdNumber(BigInt(e.target.value))}
                    onKeyDown={enterKeyHandler}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 text-base p-3"
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
                    onKeyDown={enterKeyHandler}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 text-base p-3"
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
                    onKeyDown={enterKeyHandler}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 text-base p-3"
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
                    onKeyDown={enterKeyHandler}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 text-base p-3"
                  />
                </div>

                <div>
                  <div className="mt-5 block text-lg font-medium text-gray-900">
                    Öğrenci Cinsiyeti:
                  </div>

                  <div className="grid grid-cols-2">
                    <button
                      type="button"
                      className={`m-5 inline-flex justify-center rounded-md py-2 text-base font-semibold shadow-sm w-24 ring-1 ring-inset ring-gray-300 transition-all text-gray-900 hover:bg-slate-50 focus:bg-slate-200  active:bg-slate-100
                    ${gender === "K" ? "bg-slate-200" : "bg-white"}`}
                      onClick={() => setGender("K")}
                    >
                      Kız
                    </button>
                    <button
                      type="button"
                      className={`m-5 inline-flex justify-center rounded-md py-2 text-base font-semibold shadow-sm w-24 ring-1 ring-inset ring-gray-300 transition-all text-gray-900 hover:bg-slate-50 focus:bg-slate-200  active:bg-slate-100 ${gender === "E" ? "bg-slate-200" : "bg-white"
                        }`}
                      onClick={() => setGender("E")}
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
                    inputClassName="text-base"
                    onChange={(newDate: TDateValueType | null) => {
                      if (newDate) {
                        setDate(newDate);
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-center text-base text-red-600">{error}</p>
            )}
            {message && (
              <p className="text-center text-base text-green-600">{message}</p>
            )}

            <div className="bg-gray-50 sm:flex sm:flex-row-reverse p-5">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-green-600 py-2 text-base font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-24"
                onClick={handleUpdateStudent}
              >
                Güncelle
              </button>
              <button
                type="button"
                data-autofocus
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white py-2 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-24"
                onClick={() => setOpen(false)}
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

export default UpdateStudentDialog;
