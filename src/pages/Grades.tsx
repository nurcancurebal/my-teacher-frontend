import { useEffect, useState } from "react";
import { isAxiosError } from "axios";

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import UpdateDialog from "../components/grade/UpdateDialog";
import AddDialog from "../components/grade/AddDialog";
import DeleteDialog from "../components/grade/DeleteDialog";
import GradeTypeDialog from "../components/grade/GradeTypeDialog";

import API from "../api";
import { TGradeType } from "../types";

function Grades() {
  const { t } = useTranslation();

  const [grades, setGrades] = useState<TGradeType[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<TGradeType | null>(null);
  const [addOpen, setAddOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [updateOpen, setUpdateOpen] = useState<boolean>(false);
  const [typeOpen, setTypeOpen] = useState<boolean>(false);
  const [gradeType, setGradeType] = useState<string>('');

  const fetchData = async () => {
    try {
      const response = await API.grade.allUniqueGradeType();
      setGrades(response.data.data);
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
    fetchData();
  }, []);

  const handleUpdate = (grade: TGradeType) => {
    setSelectedGrades(grade);
    setUpdateOpen(true);
  };

  const handleDelete = (grade: TGradeType) => {
    setDeleteOpen(true);
    setSelectedGrades(grade);
  };

  const handleGradeType = (gradeType: string) => {
    setGradeType(gradeType);
    setTypeOpen(true);
  }


  return (
    <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 mt-20 xl:px-0 md:px-24 px-12">
      <div className="overflow-x-auto xl:col-start-2 col-span-2 xl:p-0">

        <table className="border-collapse w-full mt-5 border border-slate-300">
          <thead>
            <tr>
              <th className="border-b border-slate-400 xl:text-xl md:text-lg text-base p-5">
                {t('GRADE_TYPE')}
              </th>
              <th className="border-b border-slate-400 xl:text-xl md:text-lg text-base p-5">
                {t("CREATED_ATE")}
              </th>
              <th className="border-b border-slate-400 xl:text-xl md:text-lg text-base p-5">
                {t(("LAST_UPDATED"))}
              </th>
              <th className="border-b border-slate-400"></th>
            </tr>
          </thead>
          <tbody>
            {grades.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-200" : "bg-gray-100"}
              >
                <td className="xl:text-lg md:text-base text-sm p-4 text-center cursor-pointer" onClick={() => handleGradeType(item.gradeType)}>
                  {item.gradeType}
                </td>
                <td className="xl:text-lg md:text-base text-sm p-4 text-center">
                  {new Date(item.createAt).toLocaleDateString()}
                </td>
                <td className="xl:text-lg md:text-base text-sm p-4 text-center">
                  {new Date(item.lastUpdated).toLocaleDateString()}
                </td>
                <td className="xl:text-lg md:text-base text-sm p-4">
                  <div className="flex justify-center mx-auto">
                    <button className="mx-4" title="Güncelle" onClick={() => {
                      handleUpdate(item);
                    }}>
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
                    <button className="mx-4" title="Sil" onClick={() => { handleDelete(item) }}>
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
                  </div>
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
            onClick={() => setAddOpen(true)}
          >
            {t('ADD_GRADE')}
          </button>
        </div>
      </div>
      <UpdateDialog
        open={updateOpen}
        grade={selectedGrades}
        setOpen={setUpdateOpen}
        fetchData={fetchData}
      />
      <AddDialog open={addOpen} setOpen={setAddOpen} />
      <DeleteDialog open={deleteOpen} setOpen={setDeleteOpen} gradeType={selectedGrades?.gradeType || ''} fetchData={fetchData} />
      <GradeTypeDialog open={typeOpen} setOpen={setTypeOpen} gradeType={gradeType} />
    </div>
  );
};

export default Grades;
