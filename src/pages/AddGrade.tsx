import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import API from "../api";
import { TStudent, TGradeValue } from "../types";

function AddGrade() {
  const { t } = useTranslation();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [students, setStudents] = useState<TStudent[]>([]);
  const [grades, setGrades] = useState<TGradeValue[]>([]);

  const { selectedClassId, formattedGradeName: gradeName } =
    location.state || {};

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await API.student.getListByClass(selectedClassId);
        setStudents(response.data.data);
        setGrades(
          response.data.data
            .filter((student: TStudent) => student.id !== undefined)
            .map((student: TStudent) => ({
              studentId: student.id as number,
              gradeValue: null,
            }))
        );
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

    if (selectedClassId) {
      fetchStudents();
    }
  }, [selectedClassId]);

  const handleGradeChange = (studentId: number, gradeValue: string) => {
    const parsedGradeValue =
      gradeValue === "" ? null : parseFloat(gradeValue);
    setGrades((prevGrades) =>
      prevGrades.map((grade) =>
        grade.studentId === studentId
          ? { ...grade, gradeValue: parsedGradeValue }
          : grade
      )
    );
  };

  const addGrade = async () => {
    setLoading(true);

    try {
      for (const grade of grades) {
        await API.grade.add({
          gradeType: gradeName,
          gradeValue: grade.gradeValue,
          classId: selectedClassId,
          studentId: grade.studentId,
        });
      }
      toast.success(t('GRADE_SUCCESSFULLY_ADDED'));
      setTimeout(() => navigate("/"), 3000);
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

  const keyDownAddGrade = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      addGrade();
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
                      value={
                        grades.find((grade) => grade.studentId === student.id)
                          ?.gradeValue ?? ""
                      }
                      onChange={(e) =>
                        student.id !== undefined && handleGradeChange(student.id, e.target.value)
                      }
                      className="block w-full rounded-md border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 xl:text-lg md:text-base text-sm mt-3"
                      onKeyDown={keyDownAddGrade}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="xl:col-start-3 md:col-start-2 xl:p-0">
          <div className="flex justify-end ">
            <button
              type="button"
              className="my-5 col-start-4 inline-flex w-44 justify-center rounded-md bg-green-600 px-3 py-2 xl:text-lg md:text-base text-sm font-semibold text-white shadow-sm hover:bg-green-500"
              onClick={addGrade}
            >
              {loading === false ? "Kayıt Et" : "Kaydediliyor..."}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default AddGrade;
