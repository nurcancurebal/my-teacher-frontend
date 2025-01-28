import React, { useState, useCallback, useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";

import instance from "../services/axiosInstance";

interface Student {
  id: number;
  class_id: number;
  teacher_id: number;
  tc: bigint;
  student_name: string;
  student_lastname: string;
  student_number: number;
  gender: string;
  birthdate: Date;
}

interface Class {
  id: number;
  teacher_id: number;
  class_name: string;
  explanation: string;
  created_at: Date;
  last_updated: Date;
}

interface FilterClassNameSelectProps {
  filteredStudents: Student[];
  handleFilter: (filtered: Student[]) => void;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const FilterClassNameSelect: React.FC<FilterClassNameSelectProps> = ({
  filteredStudents,
  handleFilter,
  setError,
}) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [localFilteredStudents, setLocalFilteredStudents] = useState<Student[]>(
    []
  );
  const [localStudents, setLocalStudents] = useState<Student[]>([]);
  const [selectClassName, setSelectClassName] = useState<string[]>([]);

  const fetchClasses = useCallback(async () => {
    try {
      const response = await instance.get("/class");
      setClasses(response.data.data);
    } catch (error) {
      setError("Sınıflar getirilirken bir hata oluştu.");
    }
  }, [setError]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  useEffect(() => {
    if (localStudents.length === 0) {
      console.log("c-useEffect1:", "filteredStudents", filteredStudents);
      setLocalStudents(filteredStudents);
    }
  }, [filteredStudents, localStudents]);

  const handleSelectClass = useCallback(
    (className: string) => {
      if (className === "Tüm Sınıflar") {
        console.log(
          "handleSelectClass1:",
          "localStudents",
          localStudents,
          "localFilteredStudents",
          localFilteredStudents,
          "selectClassName",
          selectClassName
        );
        setSelectClassName(["Tüm Sınıflar"]);
        setLocalFilteredStudents([]);
        setError(null);
        handleFilter(localStudents);
      } else {
        console.log(
          "handleSelectClass2:",
          "className",
          className,
          "localStudents",
          localStudents,
          "localFilteredStudents",
          localFilteredStudents
        );
        setSelectClassName((prev) => {
          const newClassNames = prev.filter((name) => name !== "Tüm Sınıflar");
          return [...newClassNames, className];
        });

        const selectedClassItem = classes.find(
          (classItem) => classItem.class_name === className
        );

        const filterStudent: Student[] = localStudents.filter(
          (student) => student.class_id === selectedClassItem?.id
        );

        if (localFilteredStudents.length > 0) {
          if (filterStudent.length > 0) {
            console.log(
              "handleSelectClass3:",
              "filterStudent",
              filterStudent,
              "localFilteredStudents",
              localFilteredStudents
            );
            setError(null);
            if (localFilteredStudents.length !== localStudents.length) {
              console.log("handleSelectClass3.1:", "localFilteredStudents");
              setLocalFilteredStudents([
                ...localFilteredStudents,
                ...filterStudent,
              ]);
            } else {
              console.log("handleSelectClass3.2:", "localFilteredStudents");
              setLocalFilteredStudents(filterStudent);
              handleFilter(filterStudent);
            }
            handleFilter([...localFilteredStudents, ...filterStudent]);
          } else {
            console.log(
              "handleSelectClass4:",
              "filterStudent",
              filterStudent,
              "localFilteredStudents",
              localFilteredStudents
            );
            setError(`${className} sınıfında öğrenci bulunamadı.`);
          }
        } else {
          console.log(
            "handleSelectClass5:",
            "filterStudent",
            filterStudent,
            "localFilteredStudents",
            localFilteredStudents,
            "localStudents",
            localStudents
          );

          if (filterStudent.length > 0) {
            console.log("handleSelectClass6:", "filterStudent", filterStudent);
            setError(null);
            setLocalFilteredStudents(filterStudent);
            handleFilter(filterStudent);
          } else {
            console.log("handleSelectClass7:", "filterStudent", filterStudent);
            setError(`${className} sınıfında öğrenci bulunamadı.`);
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
      setError,
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
              className={`px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:text-gray-600 data-[focus]:outline-none w-full ${
                selectClassName.includes("Tüm Sınıflar")
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
                className={`px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:text-gray-600 data-[focus]:outline-none w-full ${
                  selectClassName.includes(classItem.class_name)
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
