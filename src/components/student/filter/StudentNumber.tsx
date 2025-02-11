import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { TFilterStudentProps, TStudent } from "../../../types";

function FilterStudentNumber({
  filteredStudents,
  handleFilter,
}: TFilterStudentProps) {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [localStudents, setLocalStudents] = useState<TStudent[]>([]);

  useEffect(() => {
    if (localStudents.length === 0) {
      setLocalStudents(filteredStudents);
    }
  }, [filteredStudents, localStudents]);

  const searchInputNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (isNaN(Number(value))) {
      handleFilter(localStudents);
      toast.error(t("STUDENT_NUMBERS_CAN_CONSIST_OF_NUMERICAL_VALUES"))
      return;
    }

    if (value !== "") {
      const filtered = localStudents.filter((student) =>
        student.studentNumber.toString().includes(value)
      );

      handleFilter(filtered);
      toast.error(t("NO_STUDENT_FOUND_FOR_THIS_NUMBER"))
    } else {
      handleFilter(localStudents);
    }
  };

  return (
    <div className="relative float-right">
      <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-gray-300 max-w-80  mb-5 ml-5">
        <input
          id="price"
          name="price"
          type="text"
          placeholder={t("STUDENT_NUMBER")}
          value={searchTerm}
          onChange={searchInputNumber}
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

export default FilterStudentNumber;
