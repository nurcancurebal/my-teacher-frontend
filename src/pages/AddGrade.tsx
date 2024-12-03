import React, { useEffect, useState } from "react";
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
  student_id: number;
  grade_value: number | null;
}

const AddGrade: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const location = useLocation();
  const { selectedClassId, formattedGradeName: gradName } =
    location.state || {};
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await instance.get(`student/${selectedClassId}`);
        setStudents(response.data.data);
        setGrades(
          response.data.data.map((student: Student) => ({
            student_id: student.id,
            grade_value: null,
          }))
        );
        console.log(response.data.data);
      } catch (error) {
        setError(
          "Öğrenciler getirilirken bir hata oluştu. Lütfen tekrar deneyin."
        );
      }
    };

    if (selectedClassId) {
      fetchStudents();
    }
  }, [selectedClassId]);

  const handleGradeChange = (student_id: number, grade_value: string) => {
    const parsedGradeValue =
      grade_value === "" ? null : parseFloat(grade_value);
    setGrades((prevGrades) =>
      prevGrades.map((grade) =>
        grade.student_id === student_id
          ? { ...grade, grade_value: parsedGradeValue }
          : grade
      )
    );
  };

  const addGrade = async () => {
    try {
      await instance.post(`grade/${selectedClassId}/bulk`, {
        grades: grades.map((grade) => ({
          ...grade,
          grade_type: gradName,
        })),
      });
      setMessage("Notlar başarıyla kaydedildi.");
    } catch (error) {
      setError("Notlar kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-4 grid-cols-cols-2">
        <div className="md:col-start-2 md:col-span-2 col-span-2 md:p-0 px-12">
          <table className="border-collapse border border-slate-400 w-full">
            <thead>
              <tr>
                <th className="border border-slate-300 text-xl p-5">
                  Öğrenci Adı
                </th>
                <th className="border border-slate-300 text-xl p-5">
                  Öğrenci Soyadı
                </th>
                <th className="border border-slate-300 text-xl p-5">
                  Öğrenci Numarası
                </th>
                <th className="border border-slate-300 text-xl p-5">
                  {gradName}
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index}>
                  <td className="border border-slate-300 text-lg p-4">
                    {student.student_name}
                  </td>
                  <td className="border border-slate-300 text-lg p-4">
                    {student.student_lastname}
                  </td>
                  <td className="border border-slate-300 text-lg p-4">
                    {student.student_number}
                  </td>
                  <td className="border border-slate-300 text-lg p-4">
                    <input
                      type="text"
                      value={
                        grades.find((grade) => grade.student_id === student.id)
                          ?.grade_value || ""
                      }
                      onChange={(e) =>
                        handleGradeChange(student.id, e.target.value)
                      }
                      className="block w-full rounded-md border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 md:text-lg mt-3"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:col-start-2 md:col-span-2 col-span-2 md:p-0 px-12">
          {error && (
            <p className="my-5 text-lg text-center text-red-600">{error}</p>
          )}
          {message && (
            <p className="my-5 text-lg text-center text-green-600">{message}</p>
          )}
        </div>
        <div className="md:col-start-3 col-start-2 px-12 md:p-0">
          <div className="flex justify-end ">
            <button
              type="button"
              className="my-5 col-start-4 inline-flex w-44 justify-center rounded-md bg-green-600 px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-green-500"
              onClick={addGrade}
            >
              Kayıt Et
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default AddGrade;
