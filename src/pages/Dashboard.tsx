import { useState, useEffect } from "react";
import { isAxiosError } from "axios";

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import AddClassDialog from "../components/class/AddDialog";
import AddStudentDialog from "../components/student/AddDialog";
import AddGradeDialog from "../components/grade/AddDialog";

import API from "../api";

function Dashboard() {
  const { t } = useTranslation();

  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isSelectClassOpen, setIsSelectClassOpen] = useState(false);
  const [totalClasses, setTotalClasses] = useState<number | null>(0);
  const [totalStudents, setTotalStudents] = useState<number | null>(0);
  const [lastAddedGrade, setLastAddedGrade] = useState<string | null>(null);
  const [maleCount, setMaleCount] = useState<number>(0);
  const [femaleCount, setFemaleCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      await fetchTotalClassesFunc();
      await fetchTotalStudentsFunc();
      await fetchLastAddedGrade();
      await fetchGenderCount();
    };

    fetchData();
  }, []);

  const stats = [
    {
      id: 1,
      name: t("TOTAL_CLASSES"),
      value: totalClasses !== null ? totalClasses : 0,
    },
    {
      id: 2,
      name: t("TOTAL_STUDENTS"),
      value: totalStudents !== null ? totalStudents : 0,
    },
    {
      id: 3,
      name: t("LAST_ADDED_NOTE_DATE"),
      value: lastAddedGrade !== null ? lastAddedGrade : "N/A",
    },
  ];

  const fetchTotalClassesFunc = async () => {
    try {
      const classes = await API.class.count();
      setTotalClasses(classes.data.data);
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

  const fetchTotalStudentsFunc = async () => {
    try {
      const count = await API.student.count();
      setTotalStudents(count.data.data);
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

  const fetchLastAddedGrade = async () => {
    try {
      const response = await API.grade.findLatestGrade();

      const date = new Date(response.data.data);
      const formattedDate = date.toLocaleDateString();

      setLastAddedGrade(formattedDate);
    } catch (error: unknown) {
      console.error(error);
    }
  };

  const fetchGenderCount = async () => {
    try {
      const response = await API.student.genderCount();

      setFemaleCount(response.data.data.femaleCount);
      setMaleCount(response.data.data.maleCount);
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
                <dt className="text-base/7 text-gray-600">
                  {stat.name}
                  {stat.name === "Toplam Öğrencileriniz" ? (
                    <div>
                      <span className="text-base text-gray-500">{t("MALE")}:</span>
                      <span className="mr-2 ml-1 text-lg text-gray-500">
                        {maleCount}
                      </span>
                      <span className="text-base text-gray-500 mr-1">{t("FEMALE")}:</span>
                      <span className="text-lg text-gray-500">
                        {femaleCount}
                      </span>
                    </div>
                  ) : null}
                </dt>
                <dd className="order-first text-2xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="p-16 bg-white my-10">
        <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-3 px-5 sm:px-6 lg:px-8">
          <button
            className="px-7 py-5 text-base font-medium bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-md text-center min-w-48"
            onClick={() => setIsAddClassOpen(true)}
          >
            <span>{t("ADD_CLASS")}</span> <span className="text-xl">+</span>
          </button>
          <button
            className="px-7 py-5 text-base font-medium bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-md text-center min-w-48"
            onClick={() => setIsAddStudentOpen(true)}
          >
            {t("ADD_STUDENT")} <span className="text-xl">+</span>
          </button>
          <button
            className="px-7 py-5 text-base font-medium bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-md text-center min-w-48"
            onClick={() => setIsSelectClassOpen(true)}
          >
            {t("ADD_GRADE")} <span className="text-xl">+</span>
          </button>
        </div>
      </div>

      <AddClassDialog
        open={isAddClassOpen}
        setOpen={setIsAddClassOpen}
        onAdd={() => fetchTotalClassesFunc()}
      />
      <AddStudentDialog
        open={isAddStudentOpen}
        setOpen={setIsAddStudentOpen}
        onAdd={async () => await fetchTotalStudentsFunc()}
      />
      <AddGradeDialog open={isSelectClassOpen} setOpen={setIsSelectClassOpen} />
    </div>
  );
};

export default Dashboard;
