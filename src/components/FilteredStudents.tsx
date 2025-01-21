import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  CheckIcon,
} from "@heroicons/react/16/solid";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";

import FilterStudentGenderSelect from "./FilterStudentGenderSelect";
import FilterClassNameSelect from "./FilterClassNameSelect";
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

interface FilteredStudentsProps {
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  setClasses: React.Dispatch<React.SetStateAction<Class[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const FilteredStudents: React.FC<FilteredStudentsProps> = ({
  setStudents,
  setClasses,
  setError,
}) => {
  const [originalStudents, setOriginalStudents] = useState<Student[]>([]);
  const [localStudents, setLocalStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterSelected, setFilterSelected] = useState("Filtre");

  const navigate = useNavigate();
  const location = useLocation();

  const fetchStudents = useCallback(async () => {
    try {
      const response = await instance.get("/student");
      const studentsData = response.data.data;

      if (!studentsData || studentsData.length === 0) {
        setError("Öğrenci bulunamadı.");
        setLocalStudents([]);
        setStudents([]);
        return;
      }

      setStudents(studentsData);
      setLocalStudents(studentsData);
      setOriginalStudents(studentsData);
      setError(null);
    } catch (error) {
      setError("Öğrenciler getirilirken bir hata oluştu.");
    }
  }, [setStudents, setError]);

  const fetchClasses = useCallback(async () => {
    try {
      const response = await instance.get("/class");
      setClasses(response.data.data);
    } catch (error) {
      setError("Sınıflar getirilirken bir hata oluştu.");
    }
  }, [setClasses, setError]);

  useEffect(() => {
    fetchClasses();
    fetchStudents();
  }, [fetchClasses, fetchStudents]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const filter = queryParams.get("filter");

    if (filter && filter !== "Filtre") {
      setFilterSelected(filter);
    }
  }, [location.search]);

  const searchFirstnameLastname = (value: string) => {
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

  const searchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (filterSelected === "Öğrenci Numarası") {
      return searchStudentNumber(event.target.value);
    }

    if (filterSelected === "Öğrenci Adı Soyadı") {
      return searchFirstnameLastname(event.target.value);
    }
  };

  return (
    <>
      <Listbox
        value={filterSelected}
        onChange={(value) => {
          setFilterSelected(value);
          fetchStudents();
          navigate(`?class=Tüm Sınıflar&filter=${value}`);
        }}
      >
        <div className="relative mt-2">
          <ListboxButton className="grid cursor-default grid-cols-1 rounded-md bg-white py-1.5 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-gray-600 text-base focus:border focus:border-4 focus:border-gray-900">
            <span className="col-start-1 row-start-1 flex items-center gap-5 pr-6">
              <span className="block truncate">{filterSelected}</span>
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
              key="student_number"
              value={"Öğrenci Numarası"}
              className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-gray-600 data-[focus]:text-white data-[focus]:outline-none"
            >
              <div className="flex items-center mr-2">
                <span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
                  Öğrenci Numarası
                </span>
              </div>

              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-900 group-[&:not([data-selected])]:hidden group-data-[focus]:text-white">
                <CheckIcon aria-hidden="true" className="size-5" />
              </span>
            </ListboxOption>
            <ListboxOption
              key="student_name"
              value={"Öğrenci Adı Soyadı"}
              className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-gray-600 data-[focus]:text-white data-[focus]:outline-none"
            >
              <div className="flex items-center mr-2">
                <span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
                  Öğrenci Adı Soyadı
                </span>
              </div>

              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-900 group-[&:not([data-selected])]:hidden group-data-[focus]:text-white">
                <CheckIcon aria-hidden="true" className="size-5" />
              </span>
            </ListboxOption>
            <ListboxOption
              key="gender"
              value={"Öğrenci Cinsiyeti"}
              className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-gray-600 data-[focus]:text-white data-[focus]:outline-none"
            >
              <div className="flex items-center mr-2">
                <span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
                  Öğrenci Cinsiyeti
                </span>
              </div>

              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-900 group-[&:not([data-selected])]:hidden group-data-[focus]:text-white">
                <CheckIcon aria-hidden="true" className="size-5" />
              </span>
            </ListboxOption>
            <ListboxOption
              key="class_name"
              value={"Öğrenci Sınıfı"}
              className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-gray-600 data-[focus]:text-white data-[focus]:outline-none"
            >
              <div className="flex items-center mr-2">
                <span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
                  Öğrenci Sınıfı
                </span>
              </div>

              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-900 group-[&:not([data-selected])]:hidden group-data-[focus]:text-white">
                <CheckIcon aria-hidden="true" className="size-5" />
              </span>
            </ListboxOption>
          </ListboxOptions>
        </div>
      </Listbox>
      {filterSelected === "Öğrenci Numarası" ||
      filterSelected === "Öğrenci Adı Soyadı" ? (
        <div className="my-5 flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-gray-600 has-[input:focus-within]:border has-[input:focus-within]:border-4 has-[input:focus-within]:border-gray-900">
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
      ) : filterSelected === "Öğrenci Sınıfı" ? (
        <FilterClassNameSelect
          filterSelected={filterSelected}
          setStudents={setStudents}
          setError={setError}
        />
      ) : filterSelected === "Öğrenci Cinsiyeti" ? (
        <FilterStudentGenderSelect />
      ) : null}
    </>
  );
};

export default FilteredStudents;
