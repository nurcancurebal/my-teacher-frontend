import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { isAxiosError } from "axios";

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import API from "../../api";
import { TGrade } from "../../types";

function StudentIdGrades() {
  const location = useLocation();
  const { t } = useTranslation();

  const { studentId, firstname, lastname } =
    location.state || {};

  const [grades, setGrades] = useState<TGrade[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await API.grade.studentFindAll(studentId);
        const gradesData = response.data.data.map((grade: TGrade) => ({
          ...grade,
          createdAt: new Date(grade.createdAt || Date.now()),
          lastUpdated: new Date(grade.lastUpdated || Date.now()),
        }));
        setGrades(gradesData);

        toast.success(response.data.message);
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
    if (studentId) fetchData();

  }, []);

  return (
    <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 mt-20 xl:px-0 md:px-24 px-12">
      <div className="my-7 text-center font-semibold text-2xl xl:col-span-4 md:col-span-2">
        {firstname} {lastname} {t('ITS_GRADES')}
      </div>
      <div className="overflow-x-auto xl:col-start-2 col-span-2 xl:p-0">
        <table className="border-collapse w-full mt-5 border border-slate-300">
          <thead>
            <tr>
              <th className="border-b border-slate-400 xl:text-xl md:text-lg text-base p-5">
                {t("GRADE_TYPE")}
              </th>
              <th className="border-b border-slate-400 xl:text-xl md:text-lg text-base p-5">
                {t("GRADE_VALUE")}
              </th>
              <th className="border-b border-slate-400 xl:text-xl md:text-lg text-base p-5">
                {t("CREATED_AT")}
              </th>
              <th className="border-b border-slate-400 xl:text-xl md:text-lg text-base p-5">
                {t("UPDATED_AT")}
              </th>
            </tr>
          </thead>
          <tbody>
            {grades.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-200" : "bg-gray-100"}
              >
                <td className="xl:text-lg md:text-base text-sm p-4 text-center">
                  {item.gradeType}
                </td>
                <td className="xl:text-lg md:text-base text-sm p-4 text-center cursor-pointer">
                  {item.gradeValue}
                </td>
                <td className="xl:text-lg md:text-base text-sm p-4 text-center">
                  {item.createdAt ? item.createdAt.toLocaleDateString() : ''}
                </td>
                <td className="xl:text-lg md:text-base text-sm p-4 text-center">
                  {item.lastUpdated ? item.lastUpdated.toLocaleDateString() : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentIdGrades;