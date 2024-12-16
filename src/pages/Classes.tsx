import React, { useEffect, useState, useCallback } from "react";
import instance from "../services/axiosInstance";
import UpdateClassDialog from "../components/UpdateClassDialog";

interface Class {
  id: number;
  teacher_id: number;
  class_name: string;
  explanation: string;
  created_at: Date;
  last_updated: Date;
}

const Classes: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [studentCount, setStudentCount] = useState<{ [key: number]: number }>(
    {}
  );
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  const classesData = async () => {
    try {
      const classes = await instance.get("class");
      setClasses(classes.data.data);
    } catch (error) {
      setError("Sınıflar getirilirken bir hata oluştu.");
    }
  };

  const classInStudentCount = useCallback(async () => {
    try {
      const countPromises = classes.map(async (classItem) => {
        const response = await instance.get(
          `student/${classItem.id}/class-count`
        );
        return { classId: classItem.id, count: response.data.data };
      });
      const counts = await Promise.all(countPromises);
      const countsMap = counts.reduce((acc, { classId, count }) => {
        acc[classId] = count;
        return acc;
      }, {} as { [key: number]: number });
      setStudentCount(countsMap);
    } catch (error) {
      setError("Öğrenci sayısı getirilirken bir hata oluştu.");
    }
  }, [classes]);

  useEffect(() => {
    classesData();
  }, []);

  useEffect(() => {
    if (classes.length > 0) {
      classInStudentCount();
    }
  }, [classes, classInStudentCount]);

  const handleUpdateClick = (classItem: Class) => {
    setSelectedClass(classItem);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedClass(null);
  };

  const handleClassUpdate = () => {
    classesData(); // Sınıf listesini yeniden yükle
  };

  return (
    <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 mt-20 px-12 xl:px-0">
      <div className="overflow-x-auto xl:col-start-2 col-span-2 xl:p-0">
        <table className="border-collapse border border-slate-400 w-full">
          <thead>
            <tr>
              <th className="border border-slate-300 xl:text-xl md:text-lg text-base p-5">
                Sınıf Adı
              </th>
              <th className="border border-slate-300 xl:text-xl md:text-lg text-base p-5">
                Açıklama
              </th>
              <th className="border border-slate-300 xl:text-xl md:text-lg text-base p-5">
                Toplam Öğrenci
              </th>
              <th className="border border-slate-300 xl:text-xl md:text-lg text-base p-5">
                Oluşturulma Tarihi
              </th>
              <th className="border border-slate-300 xl:text-xl md:text-lg text-base p-5">
                Güncellenme Tarihi
              </th>
              <th className="border border-slate-300 xl:text-xl md:text-lg text-base p-5">
                Güncelle
              </th>
              <th className="border border-slate-300 xl:text-xl md:text-lg text-base p-5">
                Sil
              </th>
            </tr>
          </thead>
          <tbody>
            {classes.map((classItem, index) => (
              <tr key={index}>
                <td className="border border-slate-300 xl:text-lg md:text-base text-sm p-4 text-center">
                  {classItem.class_name}
                </td>
                <td className="border border-slate-300 xl:text-lg md:text-base text-sm p-4 text-center">
                  {classItem.explanation}
                </td>
                <td className="border border-slate-300 xl:text-lg md:text-base text-sm p-4 text-center">
                  {studentCount[classItem.id] || 0}
                </td>
                <td className="border border-slate-300 xl:text-lg md:text-base text-sm p-4 text-center">
                  {new Date(classItem.created_at).toLocaleDateString()}
                </td>
                <td className="border border-slate-300 xl:text-lg md:text-base text-sm p-4 text-center">
                  {new Date(classItem.last_updated).toLocaleDateString()}
                </td>
                <td className="border border-slate-300 xl:text-lg md:text-base text-sm p-4">
                  <button
                    className="flex m-auto"
                    onClick={() => handleUpdateClick(classItem)}
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
                <td className="border border-slate-300 xl:text-lg md:text-base text-sm p-4">
                  <button className="flex m-auto">
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
      {error && (
        <p className="mt-2 text-center text-sm/6 text-red-600">{error}</p>
      )}

      {selectedClass && (
        <UpdateClassDialog
          open={isDialogOpen}
          setOpen={handleDialogClose}
          classId={selectedClass.id}
          className={selectedClass.class_name}
          explanation={selectedClass.explanation}
          onUpdate={handleClassUpdate} // Geri çağırma fonksiyonunu geç
        />
      )}
    </div>
  );
};

export default Classes;
