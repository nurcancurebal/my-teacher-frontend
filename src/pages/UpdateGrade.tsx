import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const UpdateGrade: React.FC = () => {
  const location = useLocation();
  const { selectedClassId, gradeName } = location.state || {};
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <>
      <div className="grid md:grid-cols-4 grid-cols-cols-2">
        <div className="md:col-start-2 md:col-span-2 col-span-2 md:p-0 px-12">
          <table className="border-collapse border border-slate-400 w-full">
            <thead>
              <tr>
                <th className="border border-slate-300 text-xl p-5">
                  Öğrenci Adı
                </th>
                <th className="border border-slate-300 text-xl p-5">
                  Öğrenci Soyadı
                </th>
                <th className="border border-slate-300 text-xl p-5">
                  Öğrenci Numarası
                </th>
                <th className="border border-slate-300 text-xl p-5">
                  {gradeName}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-300 text-lg p-4">
                  student_name
                </td>
                <td className="border border-slate-300 text-lg p-4">
                  student_lastname
                </td>
                <td className="border border-slate-300 text-lg p-4">
                  student_number
                </td>
                <td className="border border-slate-300 text-lg p-4">
                  <input
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 md:text-lg mt-3"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="md:col-start-2 md:col-span-2 col-span-2 md:p-0 px-12">
          {error && (
            <p className="my-5 text-lg text-center text-red-600">{error}</p>
          )}
          {message && (
            <p className="my-5 text-lg text-center text-green-600">{message}</p>
          )}
        </div>
        <div className="md:col-start-3 col-start-2 px-12 md:p-0">
          <div className="flex justify-end ">
            <button
              type="button"
              className="my-5 col-start-4 inline-flex w-44 justify-center rounded-md bg-green-600 px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-green-500"
            >
              {loading === false ? "Kayıt Et" : "Kaydediliyor..."}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateGrade;
