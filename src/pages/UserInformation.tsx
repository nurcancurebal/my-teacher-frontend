import React, { useState, useEffect } from "react";

import UpdateProfileDialog from "../components/UpdateProfileDialog";

interface User {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  created_at: Date;
  last_updated: Date;
}

interface UserInformaitionProps {
  userData: User | null;
  onProfileUpdate: () => void;
}

const UserInformaition: React.FC<UserInformaitionProps> = ({
  userData,
  onProfileUpdate,
}) => {
  const [updateProfileOpen, setUpdateProfileOpen] = useState(false);

  const handleProfileUpdate = () => {
    console.log("user information handleProfileUpdate");
    onProfileUpdate();
  };

  useEffect(() => {
    console.log("user information useEffect");
    onProfileUpdate();
  }, [onProfileUpdate]);

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="my-5 text-center font-semibold text-2xl">
            Kullanıcı Bilgilerim
          </div>
          <div className="my-4">
            <span className="text-xl font-medium text-gray-900">
              İsim Soyisim:
            </span>
            <span className="text-lg text-gray-600 ml-3">
              {userData?.firstname} {userData?.lastname}
            </span>
          </div>
          <div className="my-4">
            <span className="text-xl font-medium text-gray-900">
              Kullanıcı Adı:
            </span>
            <span className="text-lg text-gray-600 ml-3">
              {userData?.username}
            </span>
          </div>
          <div className="my-4">
            <span className="text-xl font-medium text-gray-900">E-posta:</span>
            <span className="text-lg text-gray-600 ml-3">
              {userData?.email}
            </span>
          </div>
          <div className="my-4">
            <span className="text-xl font-medium text-gray-900">
              Kayıt Tarihi:
            </span>
            <span className="text-lg text-gray-600 ml-3">
              {userData
                ? new Date(userData.created_at).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
          <div className="my-4">
            <span className="text-xl font-medium text-gray-900">
              Son Güncelleme:
            </span>
            <span className="text-lg text-gray-600 ml-3">
              {userData
                ? new Date(userData.last_updated).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
          <div className="flex justify-end">
            <button
              className="flex w-24 justify-center rounded-md bg-green-600 px-3 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              onClick={() => setUpdateProfileOpen(true)}
            >
              Düzenle
            </button>
          </div>
        </div>
      </div>

      <UpdateProfileDialog
        open={updateProfileOpen}
        setOpen={setUpdateProfileOpen}
        onProfileUpdate={handleProfileUpdate}
      />
    </>
  );
};

export default UserInformaition;
