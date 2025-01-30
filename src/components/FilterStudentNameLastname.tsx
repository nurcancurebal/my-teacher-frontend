import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";

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

interface FilterStudentNameLastnameProps {
  filteredStudents: Student[];
  handleFilter: (filtered: Student[]) => void;
  setError: (error: string | null) => void;
}

const FilterStudentNameLastname: React.FC<FilterStudentNameLastnameProps> = ({
  filteredStudents,
  handleFilter,
  setError,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [localStudents, setLocalStudents] = useState<Student[]>([]);
  const [localFilteredStudents, setLocalFilteredStudents] = useState<Student[]>(
    []
  );

  useEffect(() => {
    console.log(
      "i-useEffect1:",
      "filteredStudents",
      filteredStudents,
      "localStudents",
      localStudents
    );
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
      console.log("i-1");
      let filtered = localStudents.filter(
        (student) =>
          student.student_name.toLowerCase().includes(value.toLowerCase()) ||
          student.student_lastname.toLowerCase().includes(value.toLowerCase())
      );
      console.log("i-filtered:", filtered);

      if (filtered.length === 0 && value.includes(" ")) {
        console.log("i-2");
        const terms = value.toLowerCase().split(" ");

        if (terms.length >= 2) {
          console.log("i-3");
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
        console.log("i-4");
        setError(`"${value}" adı veya soyadı içeren öğrenci bulunamadı.`);
        handleFilter([]);
      } else {
        console.log("i-5");
        handleFilter(filtered);
        setError(null);
      }
    } else {
      console.log("i-6");
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
