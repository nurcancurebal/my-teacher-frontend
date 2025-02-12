import { useState, useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { isAxiosError } from "axios";

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import API from "../../../api";
import { TClass, TFilterStudentMenuProps } from "../../../types";

function ClassNameMenu({
    setValue
}: TFilterStudentMenuProps) {
    const { t } = useTranslation();

    const [classes, setClasses] = useState<TClass[]>([]);
    const [filterName, setFilterName] = useState<string>(t("CLASS_NAME"));

    useEffect(() => {

        const fetchClasses = async () => {
            try {
                const response = await API.class.allList();
                setClasses(response.data.data);
            } catch (error: unknown) {
                console.error(error);
                if (isAxiosError(error) && error.response) {
                    const errorMessage = error.response?.data?.message;
                    toast.error(errorMessage || t('UNKNOWN_ERROR'));
                } else {
                    toast.error((error as Error).message || t('UNKNOWN_ERROR'));
                }
            }
        };
        fetchClasses();

    }, []);

    const handleSelectClass =
        (className: string) => {

            setFilterName(className);

            const selectedClass = classes.find(
                classItem => classItem.className === className
            );

            if (selectedClass) setValue(selectedClass.id?.toString() || "");
        };

    return (
        <div className="relative ml-5 mb-5 flex justify-end">
            <Menu as="div" className="inline-block text-left">
                <div>
                    <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-base text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        {filterName}
                        <ChevronDownIcon
                            aria-hidden="true"
                            className="size-5 text-gray-500 self-center"
                        />
                    </MenuButton>
                </div>

                <MenuItems
                    transition
                    className="absolute right-0 z-10 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in h-52 overflow-x-hidden overflow-y-scroll"
                >
                    <div className="py-1">
                        {classes.map((classItem) => (
                            <MenuItem
                                as="button"
                                key={classItem.id}
                                value={classItem.className}
                                className={`px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:text-gray-600 data-[focus]:outline-none w-full ${filterName.includes(classItem.className)
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-gray-900"
                                    }`}
                                onClick={() => handleSelectClass(classItem.className)}
                                disabled={filterName.includes(classItem.className)}
                            >
                                {classItem.className}
                            </MenuItem>
                        ))}
                    </div>
                </MenuItems>
            </Menu>
        </div>
    );
};

export default ClassNameMenu;
