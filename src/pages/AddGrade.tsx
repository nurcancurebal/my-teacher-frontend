import React, { useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import instance from "../services/axiosInstance";

const AddGrade: React.FC = () => {
  const location = useLocation();
  const { selectedClassId, gradeName } = location.state || {};

  const hasFetchedStudents = useRef(false);

  const studentsOfClass = useCallback(async (classId: number) => {
    try {
      const students = await instance.get(`student/${classId}`);
      console.log(students.data.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const gradeOfClass = useCallback(async (classId: number) => {
    try {
      const grades = await instance.get(`grade/${classId}`);
      console.log(grades.data.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (selectedClassId && !hasFetchedStudents.current) {
      studentsOfClass(selectedClassId);
      gradeOfClass(selectedClassId);
      hasFetchedStudents.current = true;
    }
  }, [selectedClassId, studentsOfClass, gradeOfClass]);

  return (
    <div>
      <h1>Add Grade</h1>
      <p>Selected Class ID: {selectedClassId}</p>
      <p>Grade Name: {gradeName}</p>
    </div>
  );
};
export default AddGrade;
