import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";

import { useTranslation } from 'react-i18next';
import { toast } from "react-toastify";

import { TFilterStudentProps, TStudent } from "../../types";

function FilterStudentNameLastname({
  filteredStudents,
  handleFilter,
}: TFilterStudentProps) {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [localStudents, setLocalStudents] = useState<TStudent[]>([]);
  const [localFilteredStudents, setLocalFilteredStudents] = useState<TStudent[]>(
    []
  );

  useEffect(() => {
    if (localStudents.length === 0) {

      setLocalStudents(filteredStudents);
    }
  }, [filteredStudents, localStudents]);

  useEffect(() => {
    if (localFilteredStudents.length !== 0) {

      handleFilter(localFilteredStudents);
    } else {
      handleFilter(localStudents);
    }
  }, [localFilteredStudents, localStudents, handleFilter]);

  const searchInputName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSearchTerm(value);

    if (value !== "") {
      let filtered = localStudents.filter(
        (student) =>
          student.studentName.toLowerCase().includes(value.toLowerCase()) ||
          student.studentLastname.toLowerCase().includes(value.toLowerCase())
      );

      if (filtered.length === 0 && value.includes(" ")) {
        const terms = value.toLowerCase().split(" ");

        if (terms.length >= 2) {
          const firstName = terms.slice(0, terms.length - 1).join(" ");
          const lastName = terms[terms.length - 1];
          filtered = localStudents.filter(
            (student) =>
              student.studentName.toLowerCase().includes(firstName) &&
              student.studentLastname.toLowerCase().includes(lastName)
          );
        }
      }

      setLocalFilteredStudents(filtered);
      if (filtered.length === 0) {
        toast.error(t("NO_STUDENTS_WITH_NAME_OR_SURNAME_FOUND"));
        handleFilter([]);
      } else {
        handleFilter(filtered);
      }
    } else {
      setLocalFilteredStudents(localStudents);
      handleFilter(localStudents);
    }
  };

  return (
    <div className="relative float-right">
      <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-gray-300 max-w-80 mb-5 ml-5">
        <input
          id="price"
          name="price"
          type="text"
          placeholder="Ad ve Soyad"
          value={searchTerm}
          onChange={searchInputName}
          onBlur={() => {
            setSearchTerm("");
          }}
          className="min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0"
        />
        <div className="grid shrink-0 grid-cols-1 focus-within:relative">
          <MagnifyingGlassIcon
            aria-hidden="true"
            className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterStudentNameLastname;
