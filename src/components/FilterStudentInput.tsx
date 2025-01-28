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

interface FilterStudentInputProps {
  filteredStudents: Student[];
  handleFilter: (filtered: Student[]) => void;
  filterNumber: boolean;
  filterNameLastname: boolean;
  setError: (error: string | null) => void;
}

const FilterStudentInput: React.FC<FilterStudentInputProps> = ({
  filteredStudents,
  handleFilter,
  filterNumber,
  filterNameLastname,
  setError,
}) => {
  const [searchTermNumber, setSearchTermNumber] = useState<string>("");
  const [searchTermName, setSearchTermName] = useState<string>("");
  const [localStudents, setLocalStudents] = useState<Student[]>([]);
  const [localFilteredStudents, setLocalFilteredStudents] = useState<Student[]>(
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

  const searchInputName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    console.log(
      "searchInputName:",
      "value",
      value,
      "localStudents",
      localStudents
    );

    setSearchTermName(value);

    if (value !== "") {
      console.log("i-1");
      let filtered = localStudents.filter(
        (student) =>
          student.student_name.toLowerCase().includes(value.toLowerCase()) ||
          student.student_lastname.toLowerCase().includes(value.toLowerCase())
      );

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

      console.log("i-filtered:", filtered);
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

  const searchInputNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("searchInputNumber:", "e.target.value", e.target.value);
    const value = e.target.value;
    setSearchTermNumber(value);

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
      {filterNameLastname ? (
        <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-gray-300 max-w-80 mb-5 ml-5">
          <input
            id="price"
            name="price"
            type="text"
            placeholder="Ad ve Soyad"
            value={searchTermName}
            onChange={searchInputName}
            /* onBlur={() => {
              setSearchTermName("");
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
      ) : null}

      {filterNumber ? (
        <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-gray-300 max-w-80  mb-5 ml-5">
          <input
            id="price"
            name="price"
            type="text"
            placeholder="Öğrenci Numarası"
            value={searchTermNumber}
            onChange={searchInputNumber}
            onBlur={() => {
              setSearchTermNumber("");
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
      ) : null}
    </div>
  );
};

export default FilterStudentInput;
