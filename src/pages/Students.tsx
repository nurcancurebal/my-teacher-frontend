import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/16/solid";
import { CheckIcon } from "@heroicons/react/20/solid";

import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";

import instance from "../services/axiosInstance";
import DetailStudentDialog from "../components/DetailStudentDialog";
import UpdateStudentDialog from "../components/UpdateStudentDialog";
import DeleteStudentDialog from "../components/DeleteStudentDialog";
import AddStudentDialog from "../components/AddStudentDialog";

interface Student {
  id: number;
  class_id: number;
  teacher_id: number;
  tc: bigint;
  student_name: string;
  student_lastname: string;
  student_number: number;
  gender: string;
  birthdate: Date;
}

interface Class {
  id: number;
  teacher_id: number;
  class_name: string;
  explanation: string;
  created_at: Date;
  last_updated: Date;
}

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedDetailStudent, setSelectedDetailStudent] =
    useState<Student | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
  const [selectedUpdateStudent, setSelectedUpdateStudent] =
    useState<Student | null>(null);
  const [selectedDeleteStudent, setSelectedDeleteStudent] =
    useState<Student | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [classSelected, classSetSelected] = useState("Tüm Sınıflar");

  const navigate = useNavigate();
  const location = useLocation();

  const fetchStudents = async () => {
    try {
      const response = await instance.get("/student");
      const studentsData = response.data.data;

      if (!studentsData || studentsData.length === 0) {
        setError("Öğrenci bulunamadı.");
        setStudents([]);
        setFilteredStudents([]);
        return;
      }

      setStudents(studentsData);
      setFilteredStudents(studentsData);
    } catch (error) {
      setError("Öğrenciler getirilirken bir hata oluştu.");
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await instance.get("/class");
      setClasses(response.data.data);
    } catch (error) {
      setError("Sınıflar getirilirken bir hata oluştu.");
    }
  };

  const handleSelectedClass = useCallback(
    async (classItem: Class) => {
      setError(null);

      if (classItem.id !== null) {
        navigate(`?class=${classItem.class_name}`);
      } else {
        navigate(`?class=tumu`);
      }

      try {
        const response = await instance.get(`/student/${classItem.id}`);
        const studentsData = response.data.data;

        if (!studentsData || studentsData.length === 0) {
          setError("Öğrenci bulunamadı.");
          setStudents([]);
          setFilteredStudents([]);
          return;
        }

        setStudents(studentsData);
        setFilteredStudents(studentsData);
      } catch (error) {
        setError("Öğrenciler getirilirken bir hata oluştu.");
      }
    },
    [navigate]
  );

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const className = queryParams.get("class");
    if (className && classes.length > 0) {
      const classItem = classes.find((c) => c.class_name === className);
      if (classItem) {
        handleSelectedClass(classItem);
      }
    } else {
      fetchStudents();
    }
  }, [location.search, handleSelectedClass, classes]);

  const handleDetailClick = (student: Student) => {
    setDetailDialogOpen(true);
    setSelectedDetailStudent(student);
  };

  const handleDetailDialogClose = () => {
    setDetailDialogOpen(false);
    setSelectedDetailStudent(null);
  };

  const handleUpdateClick = (student: Student) => {
    setUpdateDialogOpen(true);
    setSelectedUpdateStudent(student);
  };

  const handleUpdateDialogClose = () => {
    setUpdateDialogOpen(false);
    setSelectedUpdateStudent(null);
  };

  const handleDeleteClick = async (student: Student) => {
    setSelectedDeleteStudent(student);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedDeleteStudent(null);
  };

  const handleAllStudents = async () => {
    navigate(`?class=tumu`);
    fetchStudents();
    setError(null);
  };

  const handleAddStudent = () => {
    setAddDialogOpen(true);
    setError(null);
    navigate(`?class=tumu`);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    setSearchTerm(value);

    if (value === "") {
      setFilteredStudents(students);
    } else {
      // İlk aşama: Tam arama
      let filtered = students.filter(
        (student) =>
          student.student_name.toLowerCase().includes(value.toLowerCase()) ||
          student.student_lastname.toLowerCase().includes(value.toLowerCase())
      );

      // Eğer tam arama sonuç vermediyse, ikinci aşama: Bölünmüş terimlerle arama
      if (filtered.length === 0 && value.includes(" ")) {
        const terms = value.toLowerCase().split(" ");

        if (terms.length >= 2) {
          const firstName = terms.slice(0, terms.length - 1).join(" ");
          const lastName = terms[terms.length - 1];
          filtered = students.filter(
            (student) =>
              student.student_name.toLowerCase().includes(firstName) &&
              student.student_lastname.toLowerCase().includes(lastName)
          );
        }
      }

      setFilteredStudents(filtered);
      if (filtered.length === 0) {
        setError("Bu isimde öğrenci bulunamadı.");
      } else {
        setError(null);
      }
    }
  };

  const handleClassChange = (selectedClass: string) => {
    classSetSelected(selectedClass);
    if (selectedClass === "Tüm Sınıflar") {
      handleAllStudents();
    } else {
      const classItem = classes.find((c) => c.class_name === selectedClass);
      if (classItem) {
        handleSelectedClass(classItem);
      }
    }
  };

  return (
    <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 mt-20 xl:px-0 md:px-24 px-12">
      <div className="overflow-x-auto xl:col-start-2 col-span-2 xl:p-0">
        <div className="mb-5 flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-gray-600 has-[input:focus-within]:border has-[input:focus-within]:border-4 has-[input:focus-within]:border-gray-900">
          <input
            id="price"
            name="price"
            type="text"
            placeholder="Öğrenci Adı Soyadı"
            value={searchTerm}
            onChange={handleSearchChange}
            onBlur={() => {
              setSearchTerm("");
              setFilteredStudents(students);
            }}
            className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0"
          />
          <div className="grid shrink-0 grid-cols-1 focus-within:relative">
            <MagnifyingGlassIcon
              aria-hidden="true"
              className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
            />
          </div>
        </div>

        <Listbox value={classSelected} onChange={handleClassChange}>
          <Label className="block text-sm/6 font-medium text-gray-900">
            Sınıf Seçiniz
          </Label>
          <div className="relative mt-2">
            <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
              <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                <span className="block truncate">{classSelected}</span>
              </span>
              <ChevronUpDownIcon
                aria-hidden="true"
                className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
              />
            </ListboxButton>

            <ListboxOptions
              transition
              className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
            >
              <ListboxOption
                key="all"
                value={"Tüm Sınıflar"}
                className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white data-[focus]:outline-none"
              >
                <div className="flex items-center">
                  <span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
                    Tüm Sınıflar
                  </span>
                </div>

                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-[&:not([data-selected])]:hidden group-data-[focus]:text-white">
                  <CheckIcon aria-hidden="true" className="size-5" />
                </span>
              </ListboxOption>

              {classes.map((classItem) => (
                <ListboxOption
                  key={classItem.id}
                  value={classItem.class_name}
                  className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white data-[focus]:outline-none"
                >
                  <div className="flex items-center">
                    <span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
                      {classItem.class_name}
                    </span>
                  </div>

                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-[&:not([data-selected])]:hidden group-data-[focus]:text-white">
                    <CheckIcon aria-hidden="true" className="size-5" />
                  </span>
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>

        <table className="border-collapse w-full mt-5 border border-slate-300">
          <thead>
            <tr>
              <th className="border-b border-slate-400 xl:text-xl md:text-lg text-base p-5">
                Öğrenci Numarası
              </th>
              <th className="border-b border-slate-400 xl:text-xl md:text-lg text-base p-5">
                Öğrenci Adı Soyadı
              </th>
              <th className="border-b border-slate-400 xl:text-xl md:text-lg text-base p-5">
                Cinsiyeti
              </th>
              <th className="border-b border-slate-400 xl:text-xl md:text-lg text-base p-5">
                Sınıfı
              </th>
              <th className="border-b border-slate-400"></th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-200" : "bg-gray-100"}
              >
                <td className="xl:text-lg md:text-base text-sm p-4 text-center">
                  {student.student_number}
                </td>
                <td className="xl:text-lg md:text-base text-sm p-4 text-center">
                  {student.student_name} {student.student_lastname}
                </td>
                <td className="xl:text-lg md:text-base text-sm p-4 text-center">
                  {student.gender}
                </td>
                <td className="xl:text-lg md:text-base text-sm p-4 text-center">
                  {classes.find((c) => c.id === student.class_id)?.class_name}
                </td>
                <td className="xl:text-lg md:text-base text-sm p-4">
                  <div className="flex justify-center mx-auto">
                    <button
                      className="mx-4"
                      title="Detay"
                      onClick={() => handleDetailClick(student)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                        />
                      </svg>
                    </button>
                    <button
                      className="mx-4"
                      title="Güncelle"
                      onClick={() => handleUpdateClick(student)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                        />
                      </svg>
                    </button>
                    <button
                      className="mx-4"
                      title="Sil"
                      onClick={() => handleDeleteClick(student)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error && (
        <p className="mt-2 text-center xl:text-lg md:text-base text-sm text-red-600 col-start-1 col-span-4">
          {error}
        </p>
      )}
      <div className="xl:col-start-3 md:col-start-2 xl:p-0">
        <div className="flex justify-end ">
          <button
            type="button"
            className="my-5 col-start-4 inline-flex justify-center rounded-md bg-green-600 px-6 py-2 xl:text-lg md:text-base text-sm font-semibold text-white shadow-sm hover:bg-green-500"
            onClick={() => handleAddStudent()}
          >
            Öğrenci Ekle
          </button>
        </div>
      </div>

      {selectedDetailStudent && (
        <DetailStudentDialog
          open={detailDialogOpen}
          setOpen={handleDetailDialogClose}
          student={selectedDetailStudent}
        />
      )}

      {selectedUpdateStudent && (
        <UpdateStudentDialog
          open={updateDialogOpen}
          setOpen={handleUpdateDialogClose}
          student={selectedUpdateStudent}
          onUpdate={async () => await fetchStudents()} // Geri çağırma fonksiyonunu geç
        />
      )}

      {selectedDeleteStudent && (
        <DeleteStudentDialog
          open={deleteDialogOpen}
          setOpen={handleDeleteDialogClose}
          id={selectedDeleteStudent.id}
          studentName={selectedDeleteStudent.student_name}
          studentLastName={selectedDeleteStudent.student_lastname}
          onDelete={async () => await fetchStudents()} // Geri çağırma fonksiyonunu geç
        />
      )}

      {addDialogOpen && (
        <AddStudentDialog
          open={addDialogOpen}
          setOpen={() => setAddDialogOpen(false)}
          onAdd={async () => await fetchStudents()} // Geri çağırma fonksiyonunu geç
        />
      )}
    </div>
  );
};

export default Students;
