import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";


import { TFilterStudentProps, TStudent } from "../../types";

const FilterStudentNumber: React.FC<TFilterStudentProps> = ({
  filteredStudents,
  handleFilter,
  setError,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [localStudents, setLocalStudents] = useState<TStudent[]>([]);
  const [localFilteredStudents, setLocalFilteredStudents] = useState<TStudent[]>(
    []
  );

  useEffect(() => {
    console.log("i-useEffect1:", "filteredStudents", filteredStudents);
    if (localStudents.length === 0) {
      setLocalStudents(filteredStudents);
    }
  }, [filteredStudents, localStudents]);

  useEffect(() => {
    console.log(
      "i-useEffect2:",
      "localStudents",
      localStudents,
      "localFilteredStudents",
      localFilteredStudents
    );
    if (localFilteredStudents.length !== 0) {
      console.log("i-useEffect2-1");
      handleFilter(localFilteredStudents);
    } else {
      console.log("i-useEffect2-2");
      handleFilter(localStudents);
    }
    /* handleFilter(localFilteredStudents); */
  }, [localFilteredStudents, localStudents, handleFilter]);

  const searchInputNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("searchInputNumber:", "e.target.value", e.target.value);
    const value = e.target.value;
    setSearchTerm(value);

    if (isNaN(Number(value))) {
      console.log("searchInputNumber:1-2");
      handleFilter(localStudents);
      setError("Öğrenci numarası sadece sayısal değerlerden oluşabilir.");
      return;
    }

    if (value !== "") {
      console.log("searchInputNumber:1-3");
      let filtered = localStudents.filter((student) =>
        student.student_number.toString().includes(value)
      );

      handleFilter(filtered);
      setError(
        filtered.length === 0 ? "Bu numaraya ait öğrenci bulunamadı." : null
      );
    } else {
      console.log("searchInputNumber:1-4");
      handleFilter(localStudents);
      setError(null);
    }
  };

  return (
    <div className="relative float-right">
      <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-gray-300 max-w-80  mb-5 ml-5">
        <input
          id="price"
          name="price"
          type="text"
          placeholder="Öğrenci Numarası"
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
