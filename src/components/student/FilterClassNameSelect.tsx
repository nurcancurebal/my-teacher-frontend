import { useState, useCallback, useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { isAxiosError } from "axios";

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import API from "../../api";
import { TClass, TStudent, TFilterStudentProps } from "../../types";

function FilterClassNameSelect({
  filteredStudents,
  handleFilter,
}: TFilterStudentProps) {
  const { t } = useTranslation();

  const [classes, setClasses] = useState<TClass[]>([]);
  const [localFilteredStudents, setLocalFilteredStudents] = useState<TStudent[]>(
    []
  );
  const [localStudents, setLocalStudents] = useState<TStudent[]>([]);
  const [selectClassName, setSelectClassName] = useState<string[]>([]);
  const [selectedClassItem, setSelectedClassItem] = useState<TClass[]>([]);

  const fetchClasses = useCallback(async () => {
    try {
      const response = await API.class.allList();
      setClasses(response.data.data);
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

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  useEffect(() => {

    if (localStudents.length === 0) {
      setLocalStudents(filteredStudents);
    } else {
      if (
        localFilteredStudents.length > 0 &&
        filteredStudents.length !== localFilteredStudents.length
      ) {

        filteredSelectClass();
      }
    }
  }, [filteredStudents, localStudents]);

  const filteredSelectClass = () => {
    let filterStudent: TStudent[] = [];

    selectedClassItem.forEach((classItem) => {
      filterStudent = [
        ...filterStudent,
        ...filteredStudents.filter(
          (student) => student.class_id === classItem?.id
        ),
      ];
    });

    if (filterStudent.length > 0) {

      setLocalFilteredStudents(filterStudent);

      handleFilter(filterStudent);
    } else {
      toast.error(t('NO_STUDENTS_FOUND'));
    }
  };

  const handleSelectClass = useCallback(
    (className: string) => {
      if (className === "Tüm Sınıflar") {
        setSelectClassName(["Tüm Sınıflar"]);
        setLocalFilteredStudents([]);
        handleFilter(localStudents);
      } else {

        setSelectClassName((prev) => {
          const newClassNames = prev.filter((name) => name !== "Tüm Sınıflar");
          return [...newClassNames, className];
        });

        const selectedClass = classes.find(
          (classItem) => classItem.class_name === className
        );

        if (selectedClass) {
          setSelectedClassItem((prev: TClass[]) => [...prev, selectedClass]);
        }

        const filterStudent: TStudent[] = localStudents.filter(
          (student) => student.class_id === selectedClass?.id
        );

        if (localFilteredStudents.length > 0) {
          if (filterStudent.length > 0) {

            if (localFilteredStudents.length !== localStudents.length) {

              setLocalFilteredStudents([
                ...localFilteredStudents,
                ...filterStudent,
              ]);

              handleFilter([...localFilteredStudents, ...filterStudent]);
            } else {

              setLocalFilteredStudents(filterStudent);
              handleFilter(filterStudent);
            }
          } else {

            toast.error(t('NO_STUDENTS_FOUND_CLASS'));
          }
        } else {

          if (filterStudent.length > 0) {
            setLocalFilteredStudents(filterStudent);
            handleFilter(filterStudent);
          } else {
            toast.error(t('NO_STUDENTS_FOUND_CLASS'));
            handleFilter([]);
            setLocalFilteredStudents([]);
          }
        }
      }
    },
    [
      classes,
      localStudents,
      handleFilter,
      localFilteredStudents,
      selectClassName,
    ]
  );

  return (
    <div className="relative ml-5 mb-5 flex justify-end">
      <Menu as="div" className="inline-block text-left">
        <div>
          <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-base text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            Öğrenci Sınıfı
            <ChevronDownIcon
              aria-hidden="true"
              className="size-5 text-gray-500 self-center"
            />
          </MenuButton>
        </div>

        <MenuItems
          transition
          className="absolute right-0 z-10 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in h-52 overflow-x-hidden overflow-y-scroll"
        >
          <div className="py-1">
            <MenuItem
              as="button"
              key={"all"}
              value={"Tüm Sınıflar"}
              className={`px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:text-gray-600 data-[focus]:outline-none w-full ${selectClassName.includes("Tüm Sınıflar")
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-900"
                }`}
              onClick={() => handleSelectClass("Tüm Sınıflar")}
              disabled={selectClassName.includes("Tüm Sınıflar")}
            >
              Tüm Sınıflar
            </MenuItem>
            {classes.map((classItem) => (
              <MenuItem
                as="button"
                key={classItem.id}
                value={classItem.class_name}
                className={`px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:text-gray-600 data-[focus]:outline-none w-full ${selectClassName.includes(classItem.class_name)
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-900"
                  }`}
                onClick={() => handleSelectClass(classItem.class_name)}
                disabled={selectClassName.includes(classItem.class_name)}
              >
                {classItem.class_name}
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Menu>
    </div>
  );
};

export default FilterClassNameSelect;
