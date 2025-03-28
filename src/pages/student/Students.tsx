import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import DetailDialog from "../../components/student/DetailDialog";
import UpdateDialog from "../../components/student/UpdateDialog";
import DeleteDialog from "../../components/student/DeleteDialog";
import AddDialog from "../../components/student/AddDialog";
import Filtered from "../../components/student/filter/Filtered";

import API from "../../api";
import { TStudent, TClass } from "../../types";

function Students() {
  const { t } = useTranslation();
  const navigate = useNavigate();


  const [students, setStudents] = useState<TStudent[]>([]);
  const [classes, setClasses] = useState<TClass[]>([]);
  const [selectedDetailStudent, setSelectedDetailStudent] =
    useState<TStudent | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
  const [selectedUpdateStudent, setSelectedUpdateStudent] =
    useState<TStudent | null>(null);
  const [selectedDeleteStudent, setSelectedDeleteStudent] =
    useState<TStudent | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);

  const fetchStudents = useCallback(async () => {
    try {
      const response = await API.student.allList();
      const studentsData = response.data.data;

      if (!studentsData || studentsData.length === 0) {
        setStudents([]);
        return;
      }

      setStudents(studentsData);
    } catch (error: unknown) {
      console.error(error);
      if (isAxiosError(error) && error.response) {
        const errorMessage = error.response?.data?.message;
        toast.error(errorMessage || t('UNKNOWN_ERROR'));
      } else {
        toast.error((error as Error).message || t('UNKNOWN_ERROR'));
      }
    }
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await API.class.allList();
      const classesData = response.data.data;

      if (!classesData || classesData.length === 0) {
        setClasses([]);
        return;
      }

      setClasses(classesData);
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

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleDetailClick = (student: TStudent) => {
    setDetailDialogOpen(true);
    setSelectedDetailStudent(student);
  };

  const handleDetailDialogClose = () => {
    setDetailDialogOpen(false);
    setSelectedDetailStudent(null);
  };

  const handleUpdateClick = (student: TStudent) => {
    setUpdateDialogOpen(true);
    setSelectedUpdateStudent(student);
  };

  const handleUpdateDialogClose = () => {
    setUpdateDialogOpen(false);
    setSelectedUpdateStudent(null);
  };

  const handleDeleteClick = async (student: TStudent) => {
    setSelectedDeleteStudent(student);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedDeleteStudent(null);
  };

  const handleAddStudent = () => {
    setAddDialogOpen(true);
    navigate(`?class=tum-siniflar`);
  };

  const handleGradeClick = (student: TStudent) => {
    navigate("/student-grades", { state: { studentId: student.id, firstname: student.firstname, lastname: student.lastname } });
  };

  return (
    <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 mt-20 xl:px-0 md:px-24 px-12">
      <div className="my-7 text-center font-semibold text-2xl xl:col-span-4 md:col-span-2 block md:hidden">
        {t('STUDENTS')}
      </div>
      <div className="overflow-x-auto xl:col-start-2 col-span-2 xl:p-0">
        <Filtered setStudents={setStudents} />

        <table className="border-collapse w-full mt-5 border border-slate-300">
          <thead>
            <tr>
              <th className="border-b border-slate-400 xl:text-xl md:text-lg text-base p-5">
                {t('NUMBER')}
              </th>
              <th className="border-b border-slate-400 xl:text-xl md:text-lg text-base p-5">
                {t('FIRSTNAME')} {t('LASTNAME')}
              </th>
              <th className="border-b border-slate-400 xl:text-xl md:text-lg text-base p-5">
                {t("GENDER")}
              </th>
              <th className="border-b border-slate-400 xl:text-xl md:text-lg text-base p-5">
                {t("CLASS_NAME")}
              </th>
              <th className="border-b border-slate-400"></th>
              <th className="border-b border-slate-400"></th>
              <th className="border-b border-slate-400"></th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-200" : "bg-gray-100"}
              >
                <td className="xl:text-lg md:text-base text-sm p-4 text-center">
                  {student.number}
                </td>
                <td className="xl:text-lg md:text-base text-sm p-4 text-center cursor-pointer" onClick={() => handleGradeClick(student)}>
                  {student.firstname} {student.lastname}
                </td>
                <td className="xl:text-lg md:text-base text-sm p-4 text-center">
                  {student.gender === "Male" ? t("MALE") : t("FEMALE")}
                </td>
                <td className="xl:text-lg md:text-base text-sm p-4 text-center">
                  {classes.find((c) => c.id === student.classId)?.className}
                </td>
                <td className="xl:text-lg md:text-base text-sm p-4">
                  <button
                    className="flex m-auto cursor-pointer"
                    title="Detail"
                    onClick={() => handleDetailClick(student)}
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
                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                      />
                    </svg>
                  </button>
                </td>
                <td className="xl:text-lg md:text-base text-sm p-4">
                  <button
                    className="flex m-auto cursor-pointer"
                    onClick={() => handleUpdateClick(student)}
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
                <td className="xl:text-lg md:text-base text-sm p-4">
                  <button
                    className="flex m-auto cursor-pointer"
                    onClick={() => handleDeleteClick(student)}
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

      <div className="xl:col-start-3 md:col-start-2 xl:p-0">
        <div className="flex justify-end ">
          <button
            type="button"
            className="my-5 col-start-4 inline-flex justify-center rounded-md bg-green-600 px-6 py-2 xl:text-lg md:text-base text-sm font-semibold text-white shadow-sm hover:bg-green-500"
            onClick={() => handleAddStudent()}
          >
            {t('ADD_STUDENT')}
          </button>
        </div>
      </div>

      {selectedDetailStudent && (
        <DetailDialog
          open={detailDialogOpen}
          setOpen={handleDetailDialogClose}
          student={selectedDetailStudent}
        />
      )}

      {selectedUpdateStudent && (
        <UpdateDialog
          open={updateDialogOpen}
          setOpen={handleUpdateDialogClose}
          student={selectedUpdateStudent}
          onUpdate={async () => await fetchStudents()}
        />
      )}

      {selectedDeleteStudent && (
        <DeleteDialog
          open={deleteDialogOpen}
          setOpen={handleDeleteDialogClose}
          id={selectedDeleteStudent?.id ?? 0}
          firstname={selectedDeleteStudent.firstname}
          lastname={selectedDeleteStudent.lastname}
          onDelete={async () => await fetchStudents()}
        />
      )}

      {addDialogOpen && (
        <AddDialog
          open={addDialogOpen}
          setOpen={() => setAddDialogOpen(false)}
          onAdd={async () => await fetchStudents()}
        />
      )}
    </div>
  );
};

export default Students;
