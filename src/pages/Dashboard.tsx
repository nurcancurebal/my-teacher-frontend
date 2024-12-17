import React, { useState, useEffect } from "react";
import instance from "../services/axiosInstance";
import AddClassDialog from "../components/AddClassDialog";
import AddStudent from "../components/AddStudent";
import SelectAddGrade from "../components/SelectAddGrade";
import SelectUpdateGrade from "../components/SelectUpdateGrade";
import SelectTeacherNote from "../components/SelectTeacherNote";

const Dashboard: React.FC = () => {
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isSelectClassOpen, setIsSelectClassOpen] = useState(false);
  const [isSelectGradeOpen, setIsSelectGradeOpen] = useState(false);
  const [isSelectTeacherNoteOpen, setIsSelectTeacherNoteOpen] = useState(false);
  const [totalClasses, setTotalClasses] = useState<number | null>(0);
  const [totalStudents, setTotalStudents] = useState<number | null>(0);

  const stats = [
    {
      id: 1,
      name: "Toplam Sınıflarınız",
      value: totalClasses !== null ? totalClasses : 0,
    },
    {
      id: 2,
      name: "Toplam Öğrencileriniz",
      value: totalStudents !== null ? totalStudents : 0,
    },
    { id: 3, name: "En Son Eklenen Not Tarihi", value: "13.05.2024" },
  ];

  const totalClassesFunc = async () => {
    try {
      const classes = await instance.get("/class/count");
      setTotalClasses(classes.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const totalStudentsFunc = async () => {
    try {
      const count = await instance.get("/student/count");
      setTotalStudents(count.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await totalClassesFunc();
      await totalStudentsFunc();
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="bg-white py-14 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center md:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="mx-auto flex max-w-xs flex-col gap-y-4"
              >
                <dt className="text-base/7 text-gray-600">{stat.name}</dt>
                <dd className="order-first text-2xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="p-16 grid gap-6 lg:grid-cols-5 bg-white my-10">
        <button
          className="px-7 py-5 text-base font-medium bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-lg text-center"
          onClick={() => setIsAddClassOpen(true)}
        >
          Sınıf Ekle <span className="text-xl">+</span>
        </button>
        <button
          className="px-7 py-5 text-base font-medium bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-lg text-center"
          onClick={() => setIsAddStudentOpen(true)}
        >
          Öğrenci Ekle <span className="text-xl">+</span>
        </button>
        <button
          className="px-7 py-5 text-base font-medium bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-lg text-center"
          onClick={() => setIsSelectClassOpen(true)}
        >
          Not Ekle <span className="text-xl">+</span>
        </button>
        <button
          className="px-7 py-5 text-base font-medium bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-lg text-center"
          onClick={() => setIsSelectTeacherNoteOpen(true)}
        >
          Kişisel Not Ekle <span className="text-xl">+</span>
        </button>
        <button
          onClick={() => setIsSelectGradeOpen(true)}
          className="px-7 py-5 text-base font-medium bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-lg text-center"
        >
          Not Güncelle <span className="text-xl">+</span>
        </button>
      </div>

      <AddClassDialog open={isAddClassOpen} setOpen={setIsAddClassOpen} />
      <AddStudent open={isAddStudentOpen} setOpen={setIsAddStudentOpen} />
      <SelectAddGrade open={isSelectClassOpen} setOpen={setIsSelectClassOpen} />
      <SelectUpdateGrade
        open={isSelectGradeOpen}
        setOpen={setIsSelectGradeOpen}
      />
      <SelectTeacherNote
        open={isSelectTeacherNoteOpen}
        setOpen={setIsSelectTeacherNoteOpen}
      />
    </div>
  );
};

export default Dashboard;
