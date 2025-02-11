import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

import { t } from "i18next";
import { toast } from 'react-toastify';

import { TStudent, TFilterStudentProps } from "../../../types";

function FilterStudentGenderSelect({
  filteredStudents,
  handleFilter,
}: TFilterStudentProps) {
  const [genderFemale, setGenderFemale] = useState<boolean>(false);
  const [genderMale, setGenderMale] = useState<boolean>(false);
  const [localStudents, setLocalStudents] = useState<TStudent[]>([]);
  const [localFilteredStudents, setLocalFilteredStudents] = useState<TStudent[]>(
    []
  );

  const handleGenderChange = (gender: string) => {
    let filtered: TStudent[] = filteredStudents;

    if (gender === t("FEMALE")) {
      setGenderFemale(!genderFemale);
      if (genderMale) {
        filtered = localStudents;
      } else {
        filtered = localStudents.filter((student) => student.gender === "Female");
      }
    } else if (gender === t("MALE")) {
      setGenderMale(!genderMale);
      if (genderFemale) {
        filtered = localStudents;
      } else {
        filtered = localStudents.filter((student) => student.gender === "Male");
      }
    }

    if (filtered.length === 0) {
      handleFilter([]);
      setLocalFilteredStudents([]);
      toast.error(t("NO_STUDENT_FOUND"));
    } else {
      setLocalFilteredStudents(filtered);
      handleFilter(filtered);
    }
  };

  useEffect(() => {
    if (localFilteredStudents.length !== 0 && filteredStudents.length !== 0) {

      if (filteredStudents.length !== localStudents.length) {

        if (localFilteredStudents.length !== filteredStudents.length) {
          filterGenderChange();
        }
      }
    } else if (
      localFilteredStudents.length !== 0 &&
      filteredStudents.length === 0
    ) {

      handleFilter([]);
    }
  }, [localFilteredStudents, handleFilter, filteredStudents, localStudents]);

  const filterGenderChange = () => {
    if (genderFemale && !genderMale) {
      const filtered = filteredStudents.filter(
        (student) => student.gender === "Female"
      );

      handleFilter(filtered);
      setLocalFilteredStudents(filtered);
    } else if (genderMale && !genderFemale) {
      const filtered = filteredStudents.filter(
        (student) => student.gender === "Male"
      );
      handleFilter(filtered);
      setLocalFilteredStudents(filtered);
    }
  };

  useEffect(() => {

    if (localStudents.length === 0) {
      setLocalStudents(filteredStudents);
    }
  }, [filteredStudents, localStudents]);

  return (
    <div className=" px-auto mx-auto">
      <div className="relative float-right ml-5 mb-5">
        <Menu as="div" className="inline-block text-left">
          <div>
            <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-base text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              {t("GENDER")}
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
                className={`px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:text-gray-600 data-[focus]:outline-none w-full ${genderFemale
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-900"
                  }`}
                onClick={() => handleGenderChange(t("FEMALE"))}
                disabled={genderFemale}
              >
                {t("FEMALE")}
              </MenuItem>
              <MenuItem
                as="button"
                className={`px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:text-gray-600 data-[focus]:outline-none w-full ${genderMale
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-900"
                  }`}
                onClick={() => handleGenderChange(t("MALE"))}
                disabled={genderMale}
              >
                {t("MALE")}
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>
      </div>
    </div>
  );
};

export default FilterStudentGenderSelect;
