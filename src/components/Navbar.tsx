import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { TUserDataProps } from "../types";

function Navbar({ userData }: TUserDataProps) {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    {
      name: t('DASHBOARD'),
      href: "/",
      current: location.pathname === "/",
    },
    {
      name: t("CLASSES"),
      href: "/classes",
      current: location.pathname === "/classes",
    },
    {
      name: t("STUDENTS"),
      href: "/students",
      current: location.pathname === "/students",
    },
    {
      name: t("GRADES"),
      href: "/grades",
      current: location.pathname === "/grades",
    },
  ];

  const userNavigation = [
    {
      name: t("UPDATE_PROFILE"),
      href: "/update-profile",
      current: location.pathname === "/update-profile",
    },
    { name: t("LOGOUT"), href: "/login" },
  ];

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" style={{ backgroundColor: "#291b35" }}>
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="flex h-24 items-center justify-between">
              <div className="flex items-center">
                <div className="shrink-0" />
                <button
                  style={{ textShadow: "3px 2px 1px #54376d" }}
                  className="text-3xl font-sans font-bold text-white cursor-pointer"
                  onClick={() => navigate("/")}
                >
                  My Teacher
                </button>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        aria-current={item.current ? "page" : undefined}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-6 py-4 text-md font-medium"
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  <Menu as="div" className="relative ml-3">
                    <div className="flex items-center">
                      <div className="relative inline-block text-left">
                        {userData && (
                          <button
                            className="text-white text-lg mr-2 cursor-pointer"
                            onClick={() => navigate("/my-profile")}
                          >
                            {userData?.firstname} {userData?.lastname}
                          </button>
                        )}
                      </div>

                      <MenuButton className="relative flex max-w-xs items-center rounded-full hover:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 p-1 cursor-pointer">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="white"
                          className="size-7"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                        </svg>
                      </MenuButton>
                    </div>
                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in rounded-md"
                    >
                      {userNavigation.map((item) => (
                        <MenuItem key={item.name}>
                          {item.name === t("LOGOUT") ? (
                            <button
                              onClick={() => {
                                toast.success(t("EXITING"));
                                setTimeout(() => navigate(item.href), 3000);
                              }}
                              className="block w-full text-left px-4 py-2 text-lg text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                            >
                              {item.name}
                            </button>
                          ) : (
                            <Link
                              to={item.href}
                              className="block px-4 py-2 text-lg text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                            >
                              {item.name}
                            </Link>
                          )}
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Menu>
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon
                    aria-hidden="true"
                    className="block size-6 group-data-[open]:hidden"
                  />
                  <XMarkIcon
                    aria-hidden="true"
                    className="hidden size-6 group-data-[open]:block"
                  />
                </DisclosureButton>
              </div>
            </div>
          </div>

          <DisclosurePanel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
            <div className="border-t border-gray-700 pb-3 pt-4">
              <button
                className="flex items-center px-5"
                onClick={() => navigate("/my-profile")}
              >
                <div className="shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="white"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <div className="text-base/5 font-medium text-white text-left">
                    {userData?.firstname} {userData?.lastname}
                  </div>
                  <div className="text-sm font-medium text-gray-400">
                    {userData?.email}
                  </div>
                </div>
              </button>
              <div className="mt-3 space-y-1 px-2">
                {userNavigation.map((item) => (
                  <MenuItem key={item.name}>
                    {item.name === t("LOGOUT") ? (
                      <button
                        onClick={() => {
                          toast.success(t("REDIRECTING_TO_HOME_PAGE"));
                          setTimeout(() => navigate(item.href), 3000);
                        }}
                        className="block w-full text-left px-4 py-2 text-lg text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                      >
                        {item.name}
                      </button>
                    ) : (
                      <Link
                        to={item.href}
                        className="block px-4 py-2 text-lg text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                      >
                        {item.name}
                      </Link>
                    )}
                  </MenuItem>
                ))}
              </div>
            </div>
          </DisclosurePanel>
        </Disclosure>
      </div>
    </>
  );
};

export default Navbar;
