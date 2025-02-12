import { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";

import { t } from "i18next";

import { TFilterStudentMenuProps } from '../../../types'

function FilterStudentInput({
    setValue
}: TFilterStudentMenuProps) {

    const [selectedGender, setSelectedGender] = useState<string>(t("GENDER"));

    const handleGenderChange = (gender: string) => {
        setSelectedGender(gender);
        setValue(gender === t("FEMALE") ? "Female" : "Male");
    };

    return (
        <div className=" px-auto mx-auto">
            <div className="relative float-right ml-5 mb-5">
                <Menu as="div" className="inline-block text-left">
                    <div>
                        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-base text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                            {selectedGender}
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
                            {["FEMALE", "MALE"].map((genderKey) => {
                                const gender = t(genderKey);
                                const isSelected = selectedGender === gender;
                                return (
                                    <MenuItem
                                        key={genderKey}
                                        as="button"
                                        className={`px-4 py-2 text-sm w-full ${isSelected ? "text-gray-300 cursor-not-allowed" : "text-gray-900"} data-[focus]:bg-gray-100 data-[focus]:text-gray-600 data-[focus]:outline-none`}
                                        onClick={() => handleGenderChange(gender)}
                                        disabled={isSelected}
                                    >
                                        {gender}
                                    </MenuItem>
                                );
                            })}
                        </div>
                    </MenuItems>
                </Menu>
            </div>
        </div>
    );
};

export default FilterStudentInput;
