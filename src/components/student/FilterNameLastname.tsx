import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";

import { TStudent } from "../../types";

import { TFilterStudentProps } from "../../types";

const FilterStudentNameLastname: React.FC<TFilterStudentProps> = ({
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
    if (localStudents.length === 0) {
      console.log(
        "n-useEffect1:",
        "filteredStudents",
        filteredStudents,
        "localStudents",
        localStudents
      );
      setLocalStudents(filteredStudents);
    }
  }, [filteredStudents, localStudents]);

  useEffect(() => {
    if (localFilteredStudents.length !== 0) {
      console.log(
        "n-useEffect2-1",
        "localFilteredStudents",
        localFilteredStudents
      );
      handleFilter(localFilteredStudents);
    } else {
      console.log("n-useEffect2-2", "localStudents", localStudents);
      handleFilter(localStudents);
    }
    /* handleFilter(localFilteredStudents); */
  }, [localFilteredStudents, localStudents, handleFilter]);

  const searchInputName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    console.log(
      "searchInputName:",
      "value",
      value,
      "localStudents",
      localStudents
    );

    setSearchTerm(value);

    if (value !== "") {
      let filtered = localStudents.filter(
        (student) =>
          student.student_name.toLowerCase().includes(value.toLowerCase()) ||
          student.student_lastname.toLowerCase().includes(value.toLowerCase())
      );
      console.log("n-1:", "filtered", filtered);

      if (filtered.length === 0 && value.includes(" ")) {
        console.log("n-2");
        const terms = value.toLowerCase().split(" ");

        if (terms.length >= 2) {
          console.log("n-3");
          const firstName = terms.slice(0, terms.length - 1).join(" ");
          const lastName = terms[terms.length - 1];
          filtered = localStudents.filter(
            (student) =>
              student.student_name.toLowerCase().includes(firstName) &&
              student.student_lastname.toLowerCase().includes(lastName)
          );
        }
      }

      setLocalFilteredStudents(filtered);
      if (filtered.length === 0) {
        console.log("n-4");
        setError(`"${value}" adı veya soyadı içeren öğrenci bulunamadı.`);
        handleFilter([]);
      } else {
        console.log("n-5", "filtered", filtered);
        handleFilter(filtered);
        setError(null);
      }
    } else {
      console.log("n-6", "localStudents", localStudents);
      setError(null);
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
          /* onBlur={() => {
              setSearchTerm("");
            }} */
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
