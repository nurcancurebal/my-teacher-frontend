import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
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
  const { selectedClassId, formattedGradeName: gradeName } =
    location.state || {};
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    setLoading(true);
    setError("");
    setMessage("");

    try {
      for (const grade of grades) {
        await instance.post(`grade/${selectedClassId}/${grade.student_id}`, {
          grade_type: gradeName,
          grade_value: grade.grade_value,
        });
      }
      setMessage(
        "Notlar başarıyla kaydedildi. Ana sayfaya yönlendiriliyorsunuz."
      );
      setTimeout(() => navigate("/dashboard"), 3000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message;

        switch (errorMessage) {
          case "Invalid class_id":
            setError("Geçersiz sınıf.");
            break;
          case "Invalid student_id":
            setError("Geçersiz öğrenci.");
            break;
          case "This student is not in this class":
            setError("Bu öğrenci bu sınıfta değil.");
            break;
          case "Student not found in the specified class":
            setError("Öğrenci belirtilen sınıfta bulunamadı.");
            break;
          case "Not authorized to grade this student":
            setError("Bu öğrenci sizin sınıfınızda değil.");
            break;
          case "Grade of this type already exists for this student":
            setError("Bu türde bir not zaten bu öğrenci için girilmiş.");
            break;
          default:
            console.error(errorMessage);
            setError(
              "Notlar kaydedilirken bir hata oluştu. Lütfen tekrar deneyin."
            );
        }
        return;
      }
      setError("Notlar kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.");
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
                      value={
                        grades.find((grade) => grade.student_id === student.id)
                          ?.grade_value ?? ""
                      }
                      onChange={(e) =>
                        handleGradeChange(student.id, e.target.value)
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
