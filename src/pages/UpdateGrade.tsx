import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

import instance from "../services/axiosInstance";

interface Student {
  id: number;
  class_id: number;
  teacher_id: number;
  student_name: string;
  student_lastname: string;
  student_number: number;
}

interface Grade {
  id: number;
  student_id: number;
  class_id: number;
  grade_type: string;
  grade_value: number | null;
  created_at: Date;
  last_updated: Date;
}

const UpdateGrade: React.FC = () => {
  const location = useLocation();
  const { selectedClassId, gradeName } = location.state || {};
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentResponse = await instance.get(
          `student/${selectedClassId}`
        );
        const gradeResponse = await instance.get(`grade/${selectedClassId}`);

        setStudents(studentResponse.data.data);
        setGrades(gradeResponse.data.data);
      } catch (error) {
        setError("Veriler alınırken bir hata oluştu. Lütfen tekrar deneyin.");
      }
    };

    fetchData();
  }, [selectedClassId]);

  const getGradeValue = (studentId: number) => {
    const grade = grades.find(
      (grade) =>
        grade.student_id === studentId && grade.grade_type === gradeName
    );
    return grade && grade.grade_value !== null ? grade.grade_value : "-";
  };

  const handleGradeChange = (studentId: number, value: string) => {
    setError("");
    setMessage("");
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      const numericValue = value === "" ? null : parseFloat(value);
      setGrades((prevGrades) =>
        prevGrades.map((grade) =>
          grade.student_id === studentId && grade.grade_type === gradeName
            ? { ...grade, grade_value: numericValue }
            : grade
        )
      );
    } else {
      setError("Notlar sadece sayısal değerler olabilir.");
    }
  };
  const updateGradeClick = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const updatePromises = grades.map((grade) =>
        instance.patch(
          `/grade/${selectedClassId}/${grade.student_id}/${grade.id}`,
          {
            grade_value: grade.grade_value,
          }
        )
      );
      await Promise.all(updatePromises);
      setMessage("Notlar başarıyla güncellendi.");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message;
        switch (errorMessage) {
          case "Student not found in the specified class":
            setError("Öğrenci belirtilen sınıfta bulunamadı.");
            break;
          case "Not authorized to grade this student":
            setError("Bu öğrenciye not verme yetkiniz yok.");
            break;
          case "Invalid grade_id":
            setError("Geçersiz not.");
            break;
          case "Invalid student_id":
            setError("Geçersiz öğrenci.");
            break;
          case "Invalid class_id":
            setError("Geçersiz öğrenci.");
            break;
          default:
            setError("Bir hata oluştu. Lütfen tekrar deneyin.");
        }
        return;
      }
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
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
                    {student.student_name}
                  </td>
                  <td className="border border-slate-300 xl:text-lg md:text-base text-sm p-4">
                    {student.student_lastname}
                  </td>
                  <td className="border border-slate-300 xl:text-lg md:text-base text-sm p-4">
                    {student.student_number}
                  </td>
                  <td className="border border-slate-300 xl:text-lg md:text-base text-sm p-4">
                    <input
                      type="text"
                      className="block w-full rounded-md border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 xl:text-lg md:text-base text-sm mt-3"
                      defaultValue={getGradeValue(student.id)}
                      onChange={(e) =>
                        handleGradeChange(student.id, e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:col-start-2 md:col-span-2 col-span-2 md:p-0 px-12">
          {error && (
            <p className="my-5 xl:text-lg md:text-base text-sm text-center text-red-600 col-start-1 col-span-4">
              {error}
            </p>
          )}
          {message && (
            <p className="my-5 xl:text-lg md:text-base text-sm text-center text-green-600 col-start-1 col-span-4">
              {message}
            </p>
          )}
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
