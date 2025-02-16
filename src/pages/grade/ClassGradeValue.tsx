import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { isAxiosError } from "axios";

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import DetailDialog from "../../components/student/DetailDialog";
import UpdateGradeValueDialog from "../../components/grade/UpdateGradeValueDialog";
import DeleteOneDialog from "../../components/grade/DeleteOneDialog";

import API from "../../api";
import { TStudent, TGrade } from "../../types";

function ClassGradeValue() {
    const { t } = useTranslation();
    const location = useLocation();

    const { gradeType, classId, className } = location.state || {};

    const [students, setStudents] = useState<TStudent[]>([]);
    const [grades, setGrades] = useState<TGrade[]>([]);
    const [detailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
    const [updateDialogOpen, setUpdateDialogOpen] = useState<boolean>(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [selectedDetailStudent, setSelectedDetailStudent] =
        useState<TStudent | null>(null);
    const [selectedGrade, setSelectedGrade] = useState<TGrade | null>(null);

    const fetchData = async () => {
        try {
            const gradeResponse = await API.grade.classIdGrade(classId, gradeType);
            setGrades(gradeResponse.data.data);

            const studentsResponse = await API.student.getListByClass(classId);
            setStudents(studentsResponse.data.data);

            setSelectedGrade(null);
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
        fetchData();
    }, []);

    const getGrade = (studentId: number) => {
        const grade = grades.find(g => g.studentId === studentId);
        return grade ? grade.gradeValue : '-';
    };

    const handleDelete = (student: TStudent) => {
        setDeleteDialogOpen(true);
        const grade = grades.find(g => g.studentId === student.id) || null;
        setSelectedGrade(grade);
    };

    const handleUpdate = (studentId: number) => {
        setUpdateDialogOpen(true);
        const grade = grades.find(g => g.studentId === studentId) || null;
        setSelectedGrade(grade);
    };

    const handleDetail = (student: TStudent) => {
        setDetailDialogOpen(true);
        setSelectedDetailStudent(student);
    };

    return (
        <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 mt-20 xl:px-0 md:px-24 px-12">
            <div className="my-7 text-center font-semibold text-2xl xl:col-span-4 md:col-span-2">
                {`${className} ${t("CLASS_NOTES1")} ${gradeType} ${t("CLASS_NOTES2")}`}
            </div>
            <div className="overflow-x-auto xl:col-start-2 col-span-2 xl:p-0">
                <table className="border-collapse border border-slate-300 w-full">
                    <thead>
                        <tr>
                            <th className="border-b border-slate-400 xl:text-xl md:text-lg text-base p-5">
                                {t("NUMBER")}
                            </th>
                            <th className="border-b border-slate-400 xl:text-xl md:text-lg text-base p-5">
                                {t('FIRSTNAME')} {t('LASTNAME')}
                            </th>
                            <th className="border-b border-slate-400 xl:text-xl md:text-lg text-base p-5">
                                {t("GENDER")}
                            </th>
                            <th className="border-b border-slate-400 xl:text-xl md:text-lg text-base p-5">
                                {t("NOTES")}
                            </th>
                            <th className="border-b border-slate-400"></th>
                            <th className="border-b border-slate-400"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <tr
                                key={index}
                                className={index % 2 === 0 ? "bg-gray-200" : "bg-gray-100"}
                            >
                                <td className="xl:text-lg md:text-base text-sm p-4 text-center">
                                    {student.number}
                                </td>
                                <td className="xl:text-lg md:text-base text-sm p-4 text-center cursor-pointer" onClick={() => handleDetail(student)}>
                                    {student.firstname} {student.lastname}
                                </td>
                                <td className="xl:text-lg md:text-base text-sm p-4 text-center">
                                    {student.gender === "Male" ? t("MALE") : t("FEMALE")}
                                </td>
                                <td className="xl:text-lg md:text-base text-sm p-4 text-center">
                                    {getGrade(student.id!)}
                                </td>
                                <td className="xl:text-lg md:text-base text-sm p-4">
                                    <button
                                        className="flex m-auto cursor-pointer"
                                        onClick={() => handleUpdate(student.id!)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="size-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                                            />
                                        </svg>
                                    </button>
                                </td>
                                <td className="xl:text-lg md:text-base text-sm p-4">
                                    <button
                                        className="flex m-auto cursor-pointer"
                                        onClick={() => handleDelete(student)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="size-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                            />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedDetailStudent && (
                <DetailDialog
                    open={detailDialogOpen}
                    setOpen={setDetailDialogOpen}
                    student={selectedDetailStudent}
                />
            )}

            {selectedGrade && (
                <UpdateGradeValueDialog open={updateDialogOpen} setOpen={setUpdateDialogOpen} grade={selectedGrade} fetchData={fetchData} />
            )}

            {selectedGrade && (
                <DeleteOneDialog open={deleteDialogOpen} setOpen={setDeleteDialogOpen} grade={selectedGrade} fetchData={fetchData} />
            )
            }

        </div>
    );
};

export default ClassGradeValue;
