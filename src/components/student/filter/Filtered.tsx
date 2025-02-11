import { useCallback, useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { isAxiosError } from "axios";

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import Gender from "./Gender";
import ClassName from "./ClassName";
import NameLastname from "./NameLastname";
import StudentNumber from "./StudentNumber";

import API from "../../../api";
import { TStudent, TFilteredStudentsProps } from "../../../types";

function FilteredStudents({
  setStudents,
}: TFilteredStudentsProps) {
  const { t } = useTranslation();

  const [filteredStudents, setFilteredStudents] = useState<TStudent[]>([]);
  const [filterNumber, setFilterNumber] = useState<boolean>(false);
  const [filterNameLastname, setFilterNameLastname] = useState<boolean>(false);
  const [filterGender, setFilterGender] = useState<boolean>(false);
  const [filterClassName, setFilterClassName] = useState<boolean>(false);

  const fetchStudents = useCallback(async () => {
    try {
      const response = await API.student.allList();
      const studentsData = response.data.data;

      if (!studentsData || studentsData.length === 0) {
        setStudents([]);
        return;
      }

      setStudents(studentsData);
      setFilteredStudents(studentsData);
    } catch (error: unknown) {
      console.error(error);
      if (isAxiosError(error) && error.response) {
        const errorMessage = error.response?.data?.message;
        toast.error(errorMessage || t('UNKNOWN_ERROR'));
      } else {
        toast.error((error as Error).message || t('UNKNOWN_ERROR'));
      }
    }
  }, [setStudents]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleFilter = (filtered: TStudent[]) => {
    setFilteredStudents(filtered);
    setStudents(filtered);
  };

  return (
    <div className="flex flex-col ">
      <div className="relative ml-5 mb-5 flex justify-end">
        <Menu as="div" className="inline-block text-left">
          <div>
            <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-base text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              {t('FILTER')}
              <ChevronDownIcon
                aria-hidden="true"
                className="size-5 text-gray-500 self-center"
              />
            </MenuButton>
          </div>

          <MenuItems
            transition
            className="absolute right-0 z-10 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
          >
            <div className="py-1">
              <MenuItem
                as="button"
                className={`px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:text-gray-600 data-[focus]:outline-none w-full ${filterNumber
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-900"
                  }`}
                onClick={() => setFilterNumber(!filterNumber)}
                disabled={filterNumber}
              >
                {t('STUDENT_NUMBER')}
              </MenuItem>
              <MenuItem
                as="button"
                className={`px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:text-gray-600 data-[focus]:outline-none w-full ${filterNameLastname
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-900"
                  }`}
                onClick={() => setFilterNameLastname(!filterNameLastname)}
                disabled={filterNameLastname}
              >
                {t('NAME') + " " + t('LASTNAME')}
              </MenuItem>
              <MenuItem
                as="button"
                className={`px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:text-gray-600 data-[focus]:outline-none w-full ${filterGender
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-900"
                  }`}
                onClick={() => setFilterGender(!filterGender)}
                disabled={filterGender}
              >
                {t("GENDER")}
              </MenuItem>
              <MenuItem
                as="button"
                className={`px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:text-gray-600 data-[focus]:outline-none w-full ${filterClassName
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-900"
                  }`}
                onClick={() => setFilterClassName(!filterClassName)}
                disabled={filterClassName}
              >
                {t('CLASSNAME')}
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>
      </div>
      <div>
        {filterNameLastname ? (
          <NameLastname
            filteredStudents={filteredStudents}
            handleFilter={handleFilter}
          />
        ) : null}
        {filterNumber ? (
          <StudentNumber
            filteredStudents={filteredStudents}
            handleFilter={handleFilter}
          />
        ) : null}
        {filterClassName ? (
          <ClassName
            filteredStudents={filteredStudents}
            handleFilter={handleFilter}
          />
        ) : null}
        {filterGender ? (
          <Gender
            filteredStudents={filteredStudents}
            handleFilter={handleFilter}
          />
        ) : null}
      </div>
    </div>
  );
};

export default FilteredStudents;
