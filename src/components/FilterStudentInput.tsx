import React, { useState } from "react";
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

interface FilterStudentInputProps {
  students: Student[];
  filteredStudents: Student[];
  handleFilter: (filtered: Student[]) => void;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const FilterStudentInput: React.FC<FilterStudentInputProps> = ({
  students,
  filteredStudents,
  handleFilter,
  setError,
}) => {
  const searchFirstnameLastname = (value: string) => {
    const [searchTerm, setSearchTerm] = useState<string>("");

    setSearchTerm(value);

    if (value !== "") {
      let filtered = originalStudents.filter(
        (student) =>
          student.student_name.toLowerCase().includes(value.toLowerCase()) ||
          student.student_lastname.toLowerCase().includes(value.toLowerCase())
      );

      if (filtered.length === 0 && value.includes(" ")) {
        const terms = value.toLowerCase().split(" ");

        if (terms.length >= 2) {
          const firstName = terms.slice(0, terms.length - 1).join(" ");
          const lastName = terms[terms.length - 1];
          filtered = originalStudents.filter(
            (student) =>
              student.student_name.toLowerCase().includes(firstName) &&
              student.student_lastname.toLowerCase().includes(lastName)
          );
        }
      }
      setLocalStudents(filtered);
      setStudents(filtered);
      setError(filtered.length === 0 ? "Bu isimde öğrenci bulunamadı." : null);
    } else {
      setLocalStudents(originalStudents);
      setStudents(originalStudents);
      setError(null);
    }
  };

  const searchStudentNumber = (value: string) => {
    setSearchTerm(value);

    if (isNaN(Number(value))) {
      setStudents([]);
      setError("Öğrenci numarası sadece sayısal değerlerden oluşabilir.");
      return;
    }

    if (value !== "") {
      let filtered = originalStudents.filter((student) =>
        student.student_number.toString().includes(value)
      );

      setLocalStudents(filtered);
      setStudents(filtered);
      setError(
        filtered.length === 0 ? "Bu numaraya ait öğrenci bulunamadı." : null
      );
    } else {
      setLocalStudents(originalStudents);
      setStudents(originalStudents);
      setError(null);
    }
  };

  return (
    <div className="relative mb-5 float-right ml-5">
      <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-gray-600 has-[input:focus-within]:border has-[input:focus-within]:border-4 has-[input:focus-within]:border-gray-900 max-w-80">
        <input
          id="price"
          name="price"
          type="text"
          placeholder={filterSelected}
          value={searchTerm}
          onChange={searchInput}
          onBlur={() => {
            setSearchTerm("");
            setLocalStudents(localStudents);
            setStudents(localStudents);
            setError(null);
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

export default FilterStudentInput;
