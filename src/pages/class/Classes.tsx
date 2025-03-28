import { useEffect, useState, useCallback } from "react";
import { isAxiosError } from "axios";
import {
  MenuItems,
  MenuItem,
  Menu,
  MenuButton,
} from "@headlessui/react";
import { Link } from "react-router-dom";

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import UpdateDialog from "../../components/class/UpdateDialog";
import DeleteDialog from "../../components/class/DeleteDialog";
import AddDialog from "../../components/class/AddDialog";
import GradeTypeDialog from "../../components/grade/ClassGradeTypeDialog";

import API from "../../api";
import { TClass } from "../../types";

function Classes() {
  const { t } = useTranslation();

  const [classes, setClasses] = useState<TClass[]>([]);
  const [studentCount, setStudentCount] = useState<{ [key: number]: number }>(
    {}
  );
  const [updateDialogOpen, setUpdateDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedUpdateClass, setSelectedUpdateClass] = useState<TClass | null>(
    null
  );
  const [selectedDeleteClass, setSelectedDeleteClass] = useState<TClass | null>(
    null
  );

  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [gradeTypeOpen, setGradeTypeOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<TClass | null>(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await API.class.allList();
      const classesData = response.data.data;

      if (!classesData || classesData.length === 0) {
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

  const fetchStudentCounts = useCallback(async () => {
    try {
      const countPromises = classes.map(async (classItem) => {
        if (classItem.id !== undefined) {
          const response = await API.student.countByClass(classItem.id);
          return { classId: classItem.id, count: response.data.data };
        }
        return { classId: 0, count: 0 };
      });
      const counts = await Promise.all(countPromises);
      const countsMap = counts.reduce((acc, { classId, count }) => {
        if (classId !== undefined) {
          acc[classId] = count;
        }
        return acc;
      }, {} as { [key: number]: number });
      setStudentCount(countsMap);
    } catch (error: unknown) {
      console.error(error);
      if (isAxiosError(error) && error.response) {
        const errorMessage = error.response?.data?.message;
        toast.error(errorMessage || t('UNKNOWN_ERROR'));
      } else {
        toast.error((error as Error).message || t('UNKNOWN_ERROR'));
      }
    }
  }, [classes]);

  useEffect(() => {
    if (classes.length > 0) {
      fetchStudentCounts();
    }
  }, [classes, fetchStudentCounts]);

  const handleUpdateClick = (classItem: TClass) => {
    setSelectedUpdateClass(classItem);
    setUpdateDialogOpen(true);
  };

  const handleDeleteClick = (classItem: TClass) => {
    setSelectedDeleteClass(classItem);
    setDeleteDialogOpen(true);
  };

  const handleUpdateDialogClose = () => {
    setUpdateDialogOpen(false);
    setSelectedUpdateClass(null);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedUpdateClass(null);
  };

  const handleClassUpdate = async () => {
    await fetchClasses();
  };

  return (
    <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 mt-20 xl:px-0 md:px-24 px-12">
      <div className="my-7 text-center font-semibold text-2xl xl:col-span-4 md:col-span-2 block md:hidden">
        {t('CLASSES')}
      </div>
      <div className="overflow-x-auto xl:col-start-2 col-span-2 xl:p-0">
        <table className="border-collapse border border-slate-300 w-full">
          <thead>
            <tr>
              <th className="border-b border-slate-400 xl:text-xl md:text-lg text-base p-5">
                {t('CLASS_NAME')}
              </th>
              <th className="border-b border-slate-400 xl:text-xl md:text-lg text-base p-5">
                {t('DESCRIPTION')}
              </th>
              <th className="border-b border-slate-400 xl:text-xl md:text-lg text-base p-5">
                {t('TOTAL_STUDENTS')}
              </th>
              <th className="border-b border-slate-400 xl:text-xl md:text-lg text-base p-5">
                {t("CREATED_AT")}
              </th>
              <th className="border-b border-slate-400 xl:text-xl md:text-lg text-base p-5">
                {t("UPDATED_AT")}
              </th>
              <th className="border-b border-slate-400"></th>
              <th className="border-b border-slate-400"></th>
            </tr>
          </thead>
          <tbody>
            {classes.map((classItem, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-200" : "bg-gray-100"}
              >
                <td className="xl:text-lg md:text-base text-sm p-4 text-center">
                  <Menu as="div" className="relative ml-3">
                    <div className="flex items-center">
                      <MenuButton className="relative flex max-w-xs items-center text-sm focus:outline-none p-1 cursor-pointer">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <div className="relative inline-block text-left">
                          {classItem.className}
                        </div>
                      </MenuButton>
                    </div>
                    <MenuItems
                      transition
                      className="absolute left-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in rounded-md"
                    >
                      <MenuItem>
                        <Link
                          to={`/class-students/${classItem.id}/${classItem.className}`}
                          className="block px-4 py-2 text-lg text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                        >
                          {t("STUDENTS")}
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <button
                          type="button"
                          className="w-full block px-4 py-2 text-lg text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                          onClick={() => {
                            setGradeTypeOpen(true);
                            if (classItem.id !== undefined) setSelectedClass(classItem)
                          }}
                        >
                          {t("GRADES")}
                        </button>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                </td>

                <td className="xl:text-lg md:text-base text-sm p-4 text-center">
                  {classItem.explanation}
                </td>
                <td className="xl:text-lg md:text-base text-sm p-4 text-center">
                  {classItem.id !== undefined ? studentCount[classItem.id] || 0 : 0}
                </td>
                <td className="xl:text-lg md:text-base text-sm p-4 text-center">
                  {classItem.createdAt ? new Date(classItem.createdAt).toLocaleDateString() : "N/A"}
                </td>
                <td className="xl:text-lg md:text-base text-sm p-4 text-center">
                  {classItem.lastUpdated ? new Date(classItem.lastUpdated).toLocaleDateString() : "N/A"}
                </td>
                <td className="xl:text-lg md:text-base text-sm p-4">
                  <button
                    className="flex m-auto cursor-pointer"
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
                <td className="xl:text-lg md:text-base text-sm p-4">
                  <button
                    className="flex m-auto cursor-pointer"
                    onClick={() => handleDeleteClick(classItem)}
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
            onClick={() => setIsAddClassOpen(true)}
          >
            {t('ADD_CLASS')}
          </button>
        </div>
      </div>

      {
        selectedUpdateClass && selectedUpdateClass.id !== undefined && (
          <UpdateDialog
            open={updateDialogOpen}
            setOpen={handleUpdateDialogClose}
            id={selectedUpdateClass.id}
            className={selectedUpdateClass.className}
            explanation={selectedUpdateClass.explanation}
            onUpdate={handleClassUpdate}
          />
        )
      }

      {
        selectedDeleteClass && selectedDeleteClass.id !== undefined && (
          <DeleteDialog
            open={deleteDialogOpen}
            setOpen={handleDeleteDialogClose}
            id={selectedDeleteClass.id}
            className={selectedDeleteClass.className}
            onDelete={handleClassUpdate}
          />
        )
      }

      <AddDialog
        open={isAddClassOpen}
        setOpen={setIsAddClassOpen}
        onAdd={handleClassUpdate}
      />

      {
        selectedClass && selectedClass.id !== undefined && (
          <GradeTypeDialog
            open={gradeTypeOpen}
            setOpen={setGradeTypeOpen}
            classId={selectedClass.id}
            className={selectedClass.className}
          />
        )
      }
    </div >
  );
};

export default Classes;
