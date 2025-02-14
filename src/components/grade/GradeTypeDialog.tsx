import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

import { TGradeTypeDialogProps, TGrade, TClass } from "../../types";
import { useEffect } from "react";

function GradeTypeDialog({
    open, setOpen, gradeType
}: TGradeTypeDialogProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [classes, setClasses] = useState<TClass[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
    const [selectedClassName, setSelectedClassName] = useState<string | null>(null);

    useEffect(() => {
        const handleDetail = async () => {
            try {
                const response = await API.grade.allGradeType(gradeType);

                const classId = response.data.data.map((item: TGrade) => item.classId);
                const uniqueClassId = Array.from(new Set(classId));

                const classResponse = await API.class.allList();
                const filteredClassData = classResponse.data.data.filter((item: TClass) => item.id !== undefined && uniqueClassId.includes(item.id));
                setClasses(filteredClassData);

            } catch (error: unknown) {
                console.error(error);
                if (isAxiosError(error) && error.response) {
                    const errorMessage = error.response?.data?.message;
                    toast.error(errorMessage || t('UNKNOWN_ERROR'));
                } else {
                    toast.error((error as Error).message || t('UNKNOWN_ERROR'));
                }
            }
        }
        if (gradeType !== '') {
            handleDetail();
        }
    }, [gradeType]);

    const handleClose = () => {
        setOpen(false);
        setSelectedClassId(null);
        setSelectedClassName(null);
    };

    const handleContinue = () => {
        if (selectedClassId !== null && selectedClassName !== null) {
            setOpen(false);
            navigate("/class-notes", { state: { gradeType, classId: selectedClassId, className: selectedClassName } });
        } else {
            toast.error(t('SELECT_A_CLASS'));
        }
    }

    return (
        <Dialog
            open={open}
            onClose={() => {
                setOpen(false);
                setSelectedClassId(null)
                setSelectedClassName(null)
            }}
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
                        <div className="p-5">
                            <div className="sm:flex sm:items-start pb-5">
                                <div className="text-left mx-auto">
                                    <DialogTitle
                                        as="h3"
                                        className="text-2xl font-semibold text-gray-900"
                                    >
                                        {t("SELECT_A_CLASS")}
                                    </DialogTitle>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-3 grid-cols-2 gap-5">
                                {classes.map((classItem, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className={`mx-auto m-4 inline-flex w-24 py-2 justify-center rounded-md text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 focus:bg-gray-200 active:bg-gray-100 transition-all ${selectedClassId === classItem.id
                                            ? "bg-gray-200"
                                            : "bg-white"
                                            }`}
                                        onClick={() => {
                                            if (classItem.id !== undefined) {
                                                setSelectedClassId(classItem.id);
                                                setSelectedClassName(classItem.className);
                                            }
                                        }}
                                    >
                                        {classItem.className}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gray-50 sm:flex sm:flex-row-reverse p-5">
                            <button
                                type="button"
                                className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-24"
                                onClick={handleContinue}
                            >
                                {t("CONTINUE")}
                            </button>
                            <button
                                type="button"
                                data-autofocus
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 sm:mt-0 sm:w-24"
                                onClick={handleClose}
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

export default GradeTypeDialog;
