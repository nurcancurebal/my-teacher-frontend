import React from "react";
import { useLocation } from "react-router-dom";

const AddTeacherNote: React.FC = () => {
  const location = useLocation();
  const { selectedClassId, selectedStudentId } = location.state || {};
  return (
    <div>
      <h1>
        AddTeacherNote {selectedClassId} {selectedStudentId}{" "}
      </h1>
    </div>
  );
};

export default AddTeacherNote;
