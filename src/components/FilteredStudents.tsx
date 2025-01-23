import React, { useCallback, useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

import FilterStudentGenderSelect from "./FilterStudentGenderSelect";
import FilterClassNameSelect from "./FilterClassNameSelect";
import FilterStudentInput from "./FilterStudentInput";
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

interface FilteredStudentsProps {
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const FilteredStudents: React.FC<FilteredStudentsProps> = ({
  setStudents,
  setError,
}) => {
  const [students, setLocalStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [filterNumber, setFilterNumber] = useState<boolean>(false);
  const [filterNameLastname, setFilterNameLastname] = useState<boolean>(false);
  const [filterGender, setFilterGender] = useState<boolean>(false);
  const [filterClassName, setFilterClassName] = useState<boolean>(false);
  const genderDisabled = filterGender;
  const classNameDisabled = filterClassName;
  const nameLastnameDisabled = filterNameLastname;
  const numberDisabled = filterNumber;

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
      setLocalStudents(studentsData);
      setFilteredStudents(studentsData);
      setError(null);
    } catch (error) {
      setError("Öğrenciler getirilirken bir hata oluştu.");
    }
  }, [setError, setStudents]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleFilter = (filtered: Student[]) => {
    setFilteredStudents(filtered);
    setStudents(filtered);
  };

  return (
    <div className="flex flex-col ">
      <div className="relative ml-5 mb-5 flex justify-end">
        <Menu as="div" className="inline-block text-left">
          <div>
            <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-base text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              Filtre
              <ChevronDownIcon
                aria-hidden="true"
                className="size-5 text-gray-500 self-center"
              />
            </MenuButton>
          </div>

          <MenuItems
            transition
            className="absolute right-0 z-10 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
          >
            <div className="py-1">
              <MenuItem
                as="button"
                className={`px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:text-gray-600 data-[focus]:outline-none w-full ${
                  filterNumber
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-900"
                }`}
                onClick={() => setFilterNumber(!filterNumber)}
                disabled={numberDisabled}
              >
                Öğrenci Numarası
              </MenuItem>
              <MenuItem
                as="button"
                className={`px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:text-gray-600 data-[focus]:outline-none w-full ${
                  filterNameLastname
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-900"
                }`}
                onClick={() => setFilterNameLastname(!filterNameLastname)}
                disabled={nameLastnameDisabled}
              >
                Öğrenci Adı Soyadı
              </MenuItem>
              <MenuItem
                as="button"
                className={`px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:text-gray-600 data-[focus]:outline-none w-full ${
                  filterGender
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-900"
                }`}
                onClick={() => setFilterGender(!filterGender)}
                disabled={genderDisabled}
              >
                Öğrenci Cinsiyeti
              </MenuItem>
              <MenuItem
                as="button"
                className={`px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:text-gray-600 data-[focus]:outline-none w-full ${
                  filterClassName
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-900"
                }`}
                onClick={() => setFilterClassName(!filterClassName)}
                disabled={classNameDisabled}
              >
                Öğrenci Sınıfı
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>
      </div>
      <div>
        {filterNumber || filterNameLastname ? (
          <FilterStudentInput
            students={students}
            filteredStudents={filteredStudents}
            handleFilter={handleFilter}
            setError={setError}
          />
        ) : null}
        {filterClassName ? (
          <FilterClassNameSelect
            students={students}
            filteredStudents={filteredStudents}
            handleFilter={handleFilter}
            setError={setError}
          />
        ) : null}
        {filterGender ? (
          <FilterStudentGenderSelect
            students={students}
            filteredStudents={filteredStudents}
            handleFilter={handleFilter}
          />
        ) : null}
      </div>
    </div>
  );
};

export default FilteredStudents;
