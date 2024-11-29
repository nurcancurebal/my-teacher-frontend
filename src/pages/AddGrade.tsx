import React from "react";
import { useLocation } from "react-router-dom";

const AddGrade: React.FC = () => {
  const location = useLocation();
  const { selectedClassId, gradeName } = location.state || {};
  return (
    <div>
      <h1>Add Grade</h1>
      <p>Selected Class ID: {selectedClassId}</p>
      <p>Grade Name: {gradeName}</p>
    </div>
  );
};
export default AddGrade;
