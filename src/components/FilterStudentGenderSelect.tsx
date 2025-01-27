import React, { useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

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

interface FilterStudentGenderSelectProps {
  filteredStudents: Student[];
  handleFilter: (filtered: Student[]) => void;
}

const FilterStudentGenderSelect: React.FC<FilterStudentGenderSelectProps> = ({
  filteredStudents,
  handleFilter,
}) => {
  const [genderFemale, setGenderFemale] = useState<boolean>(false);
  const [genderMale, setGenderMale] = useState<boolean>(false);
  const [localStudents, setLocalStudents] = useState<Student[]>([]);
  const [localFilteredStudents, setLocalFilteredStudents] = useState<Student[]>(
    []
  );

  const handleGenderChange = (gender: string) => {
    let filtered: Student[] = filteredStudents;

    if (gender === "Kız") {
      setGenderFemale(!genderFemale);
      genderMale
        ? (filtered = localStudents)
        : (filtered = localStudents.filter(
            (student) => student.gender === "K"
          ));
    } else if (gender === "Erkek") {
      setGenderMale(!genderMale);
      genderFemale
        ? (filtered = localStudents)
        : (filtered = localStudents.filter(
            (student) => student.gender === "E"
          ));
    }

    setLocalFilteredStudents(filtered);
  };

  useEffect(() => {
    if (localFilteredStudents.length !== 0) {
      handleFilter(localFilteredStudents);
    }
  }, [localFilteredStudents, handleFilter]);

  useEffect(() => {
    handleFilter(filteredStudents);
    if (localStudents.length === 0) {
      setLocalStudents(filteredStudents);
    }
  }, [filteredStudents, handleFilter, localStudents]);

  return (
    <div className=" px-auto mx-auto">
      <div className="relative float-right ml-5 mb-5">
        <Menu as="div" className="inline-block text-left">
          <div>
            <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-base text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              Cinsiyet
              <ChevronDownIcon
                aria-hidden="true"
                className="size-5 text-gray-500 self-center"
              />
            </MenuButton>
          </div>

          <MenuItems
            transition
            className="absolute right-0 z-10 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
          >
            <div className="py-1">
              <MenuItem
                as="button"
                className={`px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:text-gray-600 data-[focus]:outline-none w-full ${
                  genderFemale
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-900"
                }`}
                onClick={() => handleGenderChange("Kız")}
                disabled={genderFemale}
              >
                Kız
              </MenuItem>
              <MenuItem
                as="button"
                className={`px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:text-gray-600 data-[focus]:outline-none w-full ${
                  genderMale
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-900"
                }`}
                onClick={() => handleGenderChange("Erkek")}
                disabled={genderMale}
              >
                Erkek
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>
      </div>
    </div>
  );
};

export default FilterStudentGenderSelect;
