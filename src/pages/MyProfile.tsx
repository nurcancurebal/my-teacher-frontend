import { useNavigate } from "react-router-dom";

import { useTranslation } from 'react-i18next';

import { TUserDataProps } from "../types";

function MyProfile({ userData }: TUserDataProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="my-7 text-center font-semibold text-2xl">
          {t('USER_INFORMATION')}
        </div>
        <div className="my-5">
          <span className="text-xl font-medium text-gray-900">
            {t("FIRSTNAME")} {t("LASTNAME")}:
          </span>
          <span className="text-lg text-gray-600 ml-3">
            {userData?.firstname} {userData?.lastname}
          </span>
        </div>
        <div className="my-4">
          <span className="text-xl font-medium text-gray-900">
            {t("USERNAME")}:
          </span>
          <span className="text-lg text-gray-600 ml-3">
            {userData?.username}
          </span>
        </div>
        <div className="my-4">
          <span className="text-xl font-medium text-gray-900"> {t("EMAIL")}:</span>
          <span className="text-lg text-gray-600 ml-3">{userData?.email}</span>
        </div>
        <div className="my-4">
          <span className="text-xl font-medium text-gray-900">
            {t("CREATED_AT")}:
          </span>
          <span className="text-lg text-gray-600 ml-3">
            {userData
              ? new Date(userData.createdAt ?? "").toLocaleDateString()
              : "N/A"}
          </span>
        </div>
        <div className="my-4">
          <span className="text-xl font-medium text-gray-900">
            {t("UPDATED_AT")}:
          </span>
          <span className="text-lg text-gray-600 ml-3">
            {userData
              ? new Date(userData.lastUpdated ?? "").toLocaleDateString()
              : "N/A"}
          </span>
        </div>
        <div className="flex justify-end">
          <button
            className="flex w-24 justify-center rounded-md bg-green-600 px-3 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            onClick={() => navigate("/update-profile")}
          >
            {t("UPDATE")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
