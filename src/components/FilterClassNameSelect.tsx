import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/16/solid";

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
  filterSelected: string;
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const FilterClassNameSelect: React.FC<FilterClassNameSelectProps> = ({
  filterSelected,
  setStudents,
  setError,
}) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [classNameSelected, setClassNameSelected] =
    useState<string>("Tüm Sınıflar");

  const navigate = useNavigate();
  const location = useLocation();

  const fetchClasses = useCallback(async () => {
    try {
      const response = await instance.get("/class");
      setClasses(response.data.data);
    } catch (error) {
      setError("Sınıflar getirilirken bir hata oluştu.");
    }
  }, [setError]);

  const fetchStudents = useCallback(async () => {
    try {
      const response = await instance.get("/student");
      const studentsData = response.data.data;

      if (!studentsData || studentsData.length === 0) {
        setStudents([]);
        setError("Öğrenci bulunamadı.");
        return;
      }

      setStudents(studentsData);
      setError(null);
    } catch (error) {
      setError("Öğrenciler getirilirken bir hata oluştu.");
    }
  }, [setError, setStudents]);

  const handleSelectedClass = useCallback(
    async (classItem: Class) => {
      navigate(`?class=${classItem.class_name}&filter=${filterSelected}`);

      try {
        const response = await instance.get(`/student/${classItem.id}`);
        const studentsData = response.data.data;

        if (!studentsData || studentsData.length === 0) {
          setError("Öğrenci bulunamadı.");
          setStudents([]);
          return;
        }

        setStudents(studentsData);
        setError(null);
      } catch (error) {
        setError("Öğrenciler getirilirken bir hata oluştu.");
      }
    },
    [filterSelected, navigate, setError, setStudents]
  );

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const className = queryParams.get("class");

    if (className && classes.length > 0) {
      const classItem = classes.find((c) => c.class_name === className);
      if (classItem) {
        setClassNameSelected(classItem.class_name);
        handleSelectedClass(classItem);
      } else {
        fetchStudents();
      }
    } else {
      fetchStudents();
    }
  }, [location.search, classes, handleSelectedClass, fetchStudents]);

  useEffect(() => {
    if (filterSelected !== "Öğrenci Sınıfı") {
      setClassNameSelected("Tüm Sınıflar");
      navigate(`?filter=${filterSelected}`);
    }
  }, [filterSelected, navigate]);

  const handleClassChange = (classNameSelected: string) => {
    if (classNameSelected === "Tüm Sınıflar") {
      navigate(`?class=Tüm Sınıflar&filter=${filterSelected}`);
      fetchStudents();
      setError(null);
    } else {
      const classItem = classes.find((c) => c.class_name === classNameSelected);
      if (classItem) {
        handleSelectedClass(classItem);
      }
    }
    setClassNameSelected(classNameSelected);
  };

  return (
    <Listbox value={classNameSelected} onChange={handleClassChange}>
      <div className="relative mt-2">
        <ListboxButton className="grid cursor-default grid-cols-1 rounded-md bg-white py-1.5 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-gray-600 text-base focus:border focus:border-4 focus:border-gray-900">
          <span className="col-start-1 row-start-1 flex items-center gap-5 pr-6">
            <span className="block truncate">{classNameSelected}</span>
          </span>
          <ChevronDownIcon
            aria-hidden="true"
            className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          />
        </ListboxButton>

        <ListboxOptions
          transition
          className="absolute z-10 mt-1 max-h-56 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in"
        >
          <ListboxOption
            key="all"
            value={"Tüm Sınıflar"}
            className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-gray-600 data-[focus]:text-white data-[focus]:outline-none"
          >
            <div className="flex items-center mr-2">
              <span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
                Tüm Sınıflar
              </span>
            </div>

            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-900 group-[&:not([data-selected])]:hidden group-data-[focus]:text-white">
              <CheckIcon aria-hidden="true" className="size-5" />
            </span>
          </ListboxOption>
          {classes.map((classItem) => (
            <ListboxOption
              key={classItem.id}
              value={classItem.class_name}
              className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-gray-600 data-[focus]:text-white data-[focus]:outline-none"
            >
              <div className="flex items-center">
                <span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
                  {classItem.class_name}
                </span>
              </div>

              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-900 group-[&:not([data-selected])]:hidden group-data-[focus]:text-white">
                <CheckIcon aria-hidden="true" className="size-5" />
              </span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
};

export default FilterClassNameSelect;
