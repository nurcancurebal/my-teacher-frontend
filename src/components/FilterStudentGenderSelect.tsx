import React, { useState } from "react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/16/solid";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";

const FilterStudentGenderSelect: React.FC = () => {
  const [genderSelected, setGenderSelected] = useState("Cinsiyet");

  const handleGenderChange = (genderSelected: string) => {
    console.log(genderSelected);
    setGenderSelected(genderSelected);
  };

  return (
    <Listbox value={genderSelected} onChange={handleGenderChange}>
      <div className="relative mt-2">
        <ListboxButton className="grid cursor-default grid-cols-1 rounded-md bg-white py-1.5 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-gray-600 text-base focus:border focus:border-4 focus:border-gray-900">
          <span className="col-start-1 row-start-1 flex items-center gap-5 pr-6">
            <span className="block truncate">{genderSelected}</span>
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
            key="female"
            value={"Kız"}
            className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-gray-600 data-[focus]:text-white data-[focus]:outline-none"
          >
            <div className="flex items-center mr-2">
              <span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
                Kız
              </span>
            </div>

            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-900 group-[&:not([data-selected])]:hidden group-data-[focus]:text-white">
              <CheckIcon aria-hidden="true" className="size-5" />
            </span>
          </ListboxOption>
          <ListboxOption
            key="male"
            value={"Erkek"}
            className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-gray-600 data-[focus]:text-white data-[focus]:outline-none"
          >
            <div className="flex items-center mr-2">
              <span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
                Erkek
              </span>
            </div>

            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-900 group-[&:not([data-selected])]:hidden group-data-[focus]:text-white">
              <CheckIcon aria-hidden="true" className="size-5" />
            </span>
          </ListboxOption>
        </ListboxOptions>
      </div>
    </Listbox>
  );
};

export default FilterStudentGenderSelect;
