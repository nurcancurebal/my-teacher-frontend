import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { isAxiosError } from "axios";

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import API from "../api";
import { TGrade, TStudent } from "../types";

function UpdateGrade() {
  const { t } = useTranslation();
  const location = useLocation();

  const { selectedClassId, gradeName } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<TStudent[]>([]);
  const [grades, setGrades] = useState<TGrade[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentResponse = await API.student.getListByClass(selectedClassId);
        const gradeResponse = await API.grade.classFindAll(selectedClassId);

        setStudents(studentResponse.data.data);
        setGrades(gradeResponse.data.data);
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

    fetchData();
  }, [selectedClassId]);

  const getGradeValue = (studentId: number) => {
    const grade = grades.find(
      (grade) =>
        grade.studentId === studentId && grade.gradeType === gradeName
    );
    return grade && grade.gradeValue !== null ? grade.gradeValue : "-";
  };

  const handleGradeChange = (studentId: number, value: string) => {

    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      const numericValue = value === "" ? null : parseFloat(value);
      setGrades((prevGrades) =>
        prevGrades.map((grade) =>
          grade.studentId === studentId && grade.gradeType === gradeName
            ? { ...grade, gradeValue: numericValue }
            : grade
        )
      );
    } else {
      toast.error(t("GRADES_CAN_BE_NUMERIC"));
    }
  };
  const updateGradeClick = async () => {
    setLoading(true);

    try {
      const updatePromises = grades.map((grade) =>
        API.grade.update({
          id: grade.id!,
          studentId: grade.studentId,
          classId: selectedClassId,
          gradeType: gradeName,
          gradeValue: grade.gradeValue
        })
      );
      await Promise.all(updatePromises);
      toast.success(t("GRADE_SUCCESSFULLY_ADDED"));
    } catch (error: unknown) {
      console.error(error);
      if (isAxiosError(error) && error.response) {
        const errorMessage = error.response?.data?.message;
        toast.error(errorMessage || t('UNKNOWN_ERROR'));
      } else {
        toast.error((error as Error).message || t('UNKNOWN_ERROR'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 mt-20 xl:px-0 md:px-24 px-12">
        <div className="overflow-x-auto xl:col-start-2 col-span-2 xl:p-0">
          <table className="border-collapse border border-slate-400 w-full">
            <thead>
              <tr>
                <th className="border border-slate-300 xl:text-xl md:text-lg text-base p-5">
                  Öğrenci Adı
                </th>
                <th className="border border-slate-300 xl:text-xl md:text-lg text-base p-5">
                  Öğrenci Soyadı
                </th>
                <th className="border border-slate-300 xl:text-xl md:text-lg text-base p-5">
                  Öğrenci Numarası
                </th>
                <th className="border border-slate-300 xl:text-xl md:text-lg text-base p-5">
                  {gradeName}
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index}>
                  <td className="border border-slate-300 xl:text-lg md:text-base text-sm p-4">
                    {student.studentName}
                  </td>
                  <td className="border border-slate-300 xl:text-lg md:text-base text-sm p-4">
                    {student.studentLastname}
                  </td>
                  <td className="border border-slate-300 xl:text-lg md:text-base text-sm p-4">
                    {student.studentNumber}
                  </td>
                  <td className="border border-slate-300 xl:text-lg md:text-base text-sm p-4">
                    <input
                      type="text"
                      className="block w-full rounded-md border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 xl:text-lg md:text-base text-sm mt-3"
                      defaultValue={student.id !== undefined ? getGradeValue(student.id) : "-"}
                      onChange={(e) =>
                        student.id !== undefined && handleGradeChange(student.id, e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="xl:col-start-3 md:col-start-2 xl:p-0">
          <div className="flex justify-end">
            <button
              type="button"
              className="my-5 col-start-4 inline-flex justify-center rounded-md bg-green-600 px-6 py-2 xl:text-lg md:text-base text-sm font-semibold text-white shadow-sm hover:bg-green-500"
              onClick={updateGradeClick}
            >
              {loading === false ? "Güncelle" : "Değişiklikler kaydediliyor..."}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateGrade;
