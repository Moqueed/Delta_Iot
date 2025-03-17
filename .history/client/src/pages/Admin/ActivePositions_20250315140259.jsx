import React, { useState, useEffect } from "react";
import { createPosition, deletePosition, updatePosition } from "../../api/activePositions";

const PositionForm = ({ selectedPosition, refreshPositions }) => {
  // ✅ Define state at the top level
  const initialFormState = {
    job_id:"",
    position: "",
    skills: "",
    department: "",
    vacancy: "",
    manager: "",
    minimum_experience: "",
    maximum_experience: "",
    job_description: "",
    HRs: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  // ✅ Fill form when selecting a position
  useEffect(() => {
    if (selectedPosition) {
      setFormData({
        ...selectedPosition,
        skills: Array.isArray(selectedPosition.skills)
          ? selectedPosition.skills.join(", ")
          : selectedPosition.skills,
        HRs: Array.isArray(selectedPosition.HRs)
          ? selectedPosition.HRs.join(", ")
          : selectedPosition.HRs,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [selectedPosition]);

  // ✅ Handle form input changes (convert skills/HRs to arrays)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ["skills", "HRs"].includes(name)
        ? value.split(",").map((item) => item.trim())
        : value,
    });
  };

  // ✅ Add new position
  const handleAdd = async () => {
    try {
      const payload = {
        ...formData,
        skills: Array.isArray(formData.skills)
          ? formData.skills
          : formData.skills.split(",").map((skill) => skill.trim()),
      };

      await createPosition(payload);
      alert("Position added successfully!");
      setFormData(initialFormState);
      refreshPositions();
    } catch (error) {
      console.error("Failed to add position:", error);
    }
  };

  // ✅ Update existing position
  const handleUpdate = async () => {
    try {
      if (selectedPosition?.job_id) {
        const formattedData = {
          ...formData,
          skills: formData.skills.split(",").map((skill) => skill.trim()),
          HRs: formData.HRs.split(",").map((hr) => hr.trim()),
        };

        await updatePosition(selectedPosition.job_id, formattedData);
        alert("Position updated successfully!");
        refreshPositions();
      }
    } catch (error) {
      console.error("Failed to update position:", error);
      alert("Error: " + (error.response?.data?.error || error.message));
    }
  };

  // ✅ Delete position
  const handleDelete = async () => {
    try {
      if (selectedPosition?.job_id) {
        await deletePosition(selectedPosition.job_id);
        alert("Position deleted successfully!");
        setFormData(initialFormState);
        refreshPositions();
      }
    } catch (error) {
      console.error("Failed to delete position:", error);
      alert("Error: " + (error.response?.data?.error || error.message));
    }
  };

  // ✅ Render form UI
  return (
    <div className="position-form">
      <h2>Position Details</h2>

      <input
        name="Job_id"
        placeholder="Job_id"
        value={formData.Job_id}
        onChange={handleChange}
      />
      <input
        name="position"
        placeholder="Position"
        value={formData.position}
        onChange={handleChange}
      />
       <input
        name="skills"
        placeholder="Skills (comma-separated)"
        value={formData.skills}
        onChange={handleChange}
      />
       <input
        name="department"
        placeholder="Department"
        value={formData.department}
        onChange={handleChange}
      />
       <input
        name="vacancy"
        placeholder="Vacancy"
        value={formData.vacancy}
        onChange={handleChange}
      />
       <input
        name="manager"
        placeholder="HR Manager"
        value={formData.manager}
        onChange={handleChange}
      />
      <input
        name="minimum_experience"
        placeholder="Min Experience (years)"
        type="number"
        value={formData.minimum_experience}
        onChange={handleChange}
      />
      <input
        name="maximum_experience"
        placeholder="Max Experience (years)"
        type="number"
        value={formData.maximum_experience}
        onChange={handleChange}
      />
      <input
        name="job_description"
        placeholder="Job Description"
        value={formData.job_description}
        onChange={handleChange}
      />
     
      <input
        name="HRs"
        placeholder="HRs (comma-separated)"
        value={formData.HRs}
        onChange={handleChange}
      />

      {/* Button Row */}
      <div className="button-row">
        <button className="add-btn" onClick={handleAdd}>
          Add
        </button>
        <button
          className="update-btn"
          onClick={handleUpdate}
          disabled={!selectedPosition}
        >
          Update
        </button>
        <button
          className="delete-btn"
          onClick={handleDelete}
          disabled={!selectedPosition}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default PositionForm;
