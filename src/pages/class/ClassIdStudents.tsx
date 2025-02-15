import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { isAxiosError } from "axios";

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import API from "../../api";
import { TStudent } from '../../types';

function ClassIdStudents() {
    const { t } = useTranslation();
    const { classId, className } = useParams<{ classId: string, className: string }>();

    const [students, setStudents] = useState<TStudent[]>([]);


    const fetchStudents = async () => {
        try {
            const response = await API.student.getListByClass(Number(classId));
            setStudents(response.data.data);
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

    useEffect(() => {
        fetchStudents();
    }, []);

    return (
        <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 mt-20 xl:px-0 md:px-24 px-12">
            <div className="my-7 text-center font-semibold text-2xl xl:col-span-4 md:col-span-2">
                {`${className} ${t("CLASS_STUDENTS")}`}
            </div>
            <div className="overflow-x-auto xl:col-start-2 col-span-2 xl:p-0">
                <table className="border-collapse w-full mt-5 border border-slate-300">
                    <thead>
                        <tr>
                            <th className="border-b border-slate-400 xl:text-xl md:text-lg text-base p-5">
                                {t('ID_NUMBER')}
                            </th>

                            <th className="border-b border-slate-400 xl:text-xl md:text-lg text-base p-5">
                                {t('FIRSTNAME')} {t('LASTNAME')}
                            </th>
                            <th className="border-b border-slate-400 xl:text-xl md:text-lg text-base p-5">
                                {t("GENDER")}
                            </th>
                            <th className="border-b border-slate-400 xl:text-xl md:text-lg text-base p-5">
                                {t('NUMBER')}
                            </th>
                            <th className="border-b border-slate-400 xl:text-xl md:text-lg text-base p-5">
                                {t('BIRTHDAY')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <tr
                                key={index}
                                className={index % 2 === 0 ? "bg-gray-200" : "bg-gray-100"}
                            >
                                <td className="xl:text-lg md:text-base text-sm p-4 text-center">
                                    {student.idNumber}
                                </td>
                                <td className="xl:text-lg md:text-base text-sm p-4 text-center">
                                    {student.firstname} {student.lastname}
                                </td>
                                <td className="xl:text-lg md:text-base text-sm p-4 text-center">
                                    {student.gender === "Male" ? t("MALE") : t("FEMALE")}
                                </td>
                                <td className="xl:text-lg md:text-base text-sm p-4 text-center">
                                    {student.number}
                                </td>
                                <td className="xl:text-lg md:text-base text-sm p-4 text-center">
                                    {student.birthday ? new Date(student.birthday).toLocaleDateString() : ''}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClassIdStudents;
