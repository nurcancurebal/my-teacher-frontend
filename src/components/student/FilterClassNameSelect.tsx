import React, { useState, useCallback, useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";

import API from "../../api";

import { TClass, TStudent, TFilterStudentProps } from "../../types";

const FilterClassNameSelect: React.FC<TFilterStudentProps> = ({
  filteredStudents,
  handleFilter,
  setError,
}) => {
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
    } catch (error) {
      setError("Sınıflar getirilirken bir hata oluştu.");
    }
  }, [setError]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  useEffect(() => {
    console.log(
      "c-useEffect1:",
      "filteredStudents",
      filteredStudents,
      "localStudents",
      localStudents,
      "localFilteredStudents",
      localFilteredStudents
    );
    if (localStudents.length === 0) {
      console.log("c-useEffect1-1:", "filteredStudents", filteredStudents);
      setLocalStudents(filteredStudents);
    } else {
      if (
        localFilteredStudents.length > 0 &&
        filteredStudents.length !== localFilteredStudents.length
      ) {
        console.log(
          "c-useEffect1-2:",
          "filteredStudents",
          filteredStudents,
          "localStudents",
          localStudents
        );
        filteredSelectClass();
      }
    }
  }, [filteredStudents, localStudents]);

  const filteredSelectClass = () => {
    let filterStudent: TStudent[] = [];
    console.log("filteredSelectClass1:", "localStudents", localStudents);

    selectedClassItem.forEach((classItem) => {
      filterStudent = [
        ...filterStudent,
        ...filteredStudents.filter(
          (student) => student.class_id === classItem?.id
        ),
      ];
    });

    if (filterStudent.length > 0) {
      console.log(
        "filteredSelectClass1-1:",
        "filterStudent",
        filterStudent,
        "localFilteredStudents",
        localFilteredStudents
      );
      setError(null);

      setLocalFilteredStudents(filterStudent);

      handleFilter(filterStudent);
    } else {
      console.log(
        "filteredSelectClass2:",
        "filterStudent",
        filterStudent,
        "localFilteredStudents",
        localFilteredStudents
      );
      setError(`Öğrenci bulunamadı.`);
    }
  };

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
          localFilteredStudents,
          "filteredStudents",
          filteredStudents
        );
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
            console.log(
              "handleSelectClass3:",
              "filterStudent",
              filterStudent,
              "localFilteredStudents",
              localFilteredStudents
            );
            setError(null);

            if (localFilteredStudents.length !== localStudents.length) {
              console.log(
                "handleSelectClass3.1:",
                "localFilteredStudents",
                localFilteredStudents,
                "filterStudent",
                filterStudent
              );
              setLocalFilteredStudents([
                ...localFilteredStudents,
                ...filterStudent,
              ]);

              handleFilter([...localFilteredStudents, ...filterStudent]);
            } else {
              console.log(
                "handleSelectClass3.2:",
                "localFilteredStudents",
                localFilteredStudents,
                "filterStudent",
                filterStudent
              );
              setLocalFilteredStudents(filterStudent);
              handleFilter(filterStudent);
            }
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
