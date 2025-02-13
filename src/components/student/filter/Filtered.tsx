import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { isAxiosError } from "axios";

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import Input from "./Input";
import GenderMenu from "./GenderMenu";
import ClassNameMenu from "./ClassNameMenu";

import API from "../../../api";
import { TFilteredStudentsProps } from "../../../types";

function Filtered({
  setStudents,
}: TFilteredStudentsProps) {
  const { t } = useTranslation();

  const [showArea, setShowArea] = useState<string[]>([]);

  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [number, setNumber] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [classId, setClassId] = useState<string>("");

  const toggleShowArea = (area: string) => {
    if (showArea.includes(area)) {
      setShowArea(showArea.filter((item) => item !== area));

      switch (area) {
        case t('LASTNAME'):
          setLastname("");
          break;
        case t('FIRSTNAME'):
          setFirstname("");
          break;
        case t('NUMBER'):
          setNumber("");
          break;
        case t('GENDER'):
          setGender("");
          break;
        case t('CLASS_ID'):
          setClassId("");
          break;
        default:
          break;
      }
      fetchStudents();
    } else {
      setShowArea([...showArea, area]);
    }
  };

  const showAreaCheck = (area: string) => {
    return showArea.includes(area);
  }

  const fetchStudents = async () => {
    try {
      const filter: { [key: string]: string } = {};

      if (firstname) {
        filter["firstname"] = firstname;
      }

      if (lastname) {
        filter["lastname"] = lastname;
      }

      if (number) {
        filter["number"] = number;
      }

      if (gender) {
        filter["gender"] = gender;
      } else {
        filter["gender"] = "";
      }

      if (classId) {
        filter["classId"] = classId;
      }

      const response = await API.student.filterStudent(filter);
      const studentsData = response.data.data;

      setStudents(studentsData && studentsData.length === 0 ? [] : studentsData);
    } catch (error: unknown) {
      console.error(error);
      if (isAxiosError(error) && error.response) {
        const errorMessage = error.response?.data?.message;
        toast.error(errorMessage || t('UNKNOWN_ERROR'));
      } else {
        toast.error((error as Error).message || t('UNKNOWN_ERROR'));
      }
    }

  }

  useEffect(() => {
    fetchStudents();
  }, [firstname, lastname, number, gender, classId]);

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
                className={`px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:text-gray-600 data-[focus]:outline-none w-full ${showAreaCheck("NUMBER")
                  ? "text-gray-300"
                  : "text-gray-900"
                  }`}
                onClick={() => toggleShowArea("NUMBER")}
              >
                {t('NUMBER')}
              </MenuItem>
              <MenuItem
                as="button"
                className={`px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:text-gray-600 data-[focus]:outline-none w-full ${showAreaCheck("FIRSTNAME")
                  ? "text-gray-300"
                  : "text-gray-900"
                  }`}
                onClick={() => toggleShowArea("FIRSTNAME")}
              >
                {t('NAME')}
              </MenuItem>
              <MenuItem
                as="button"
                className={`px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:text-gray-600 data-[focus]:outline-none w-full ${showAreaCheck("LASTNAME")
                  ? "text-gray-300"
                  : "text-gray-900"
                  }`}
                onClick={() => toggleShowArea("LASTNAME")}
              >
                {t('LASTNAME')}
              </MenuItem>
              <MenuItem
                as="button"
                className={`px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:text-gray-600 data-[focus]:outline-none w-full ${showAreaCheck("GENDER")
                  ? "text-gray-300"
                  : "text-gray-900"
                  }`}
                onClick={() => toggleShowArea("GENDER")}
              >
                {t("GENDER")}
              </MenuItem>
              <MenuItem
                as="button"
                className={`px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:text-gray-600 data-[focus]:outline-none w-full ${showAreaCheck("CLASS_ID")
                  ? "text-gray-300"
                  : "text-gray-900"
                  }`}
                onClick={() => toggleShowArea("CLASS_ID")}
              >
                {t('CLASS_NAME')}
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>
      </div>
      <div>
        {showAreaCheck("LASTNAME") ? (
          <Input
            setValue={setLastname} value={lastname} placeholder={t('LASTNAME')}
          />
        ) : null}
        {showAreaCheck("FIRSTNAME") ? (
          <Input
            setValue={setFirstname} value={firstname} placeholder={t('NAME')}
          />
        ) : null}
        {showAreaCheck("NUMBER") ? (
          <Input
            setValue={setNumber} value={number} placeholder={t('NUMBER')}
          />
        ) : null}
        {showAreaCheck("GENDER") ? (
          <GenderMenu
            setValue={setGender}
          />
        ) : null}
        {showAreaCheck("CLASS_ID") ? (
          <ClassNameMenu
            setValue={setClassId}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Filtered;
