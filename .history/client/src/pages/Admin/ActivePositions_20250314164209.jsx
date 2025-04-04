import React, { useState, useEffect } from "react";
import { createPosition, updatePosition, deletePosition } from "../api/positions";

const PositionForm = ({ selectedPosition, refreshPositions }) => {
  const [formData, setFormData] = useState({
    position: "",
    job_description: "",
    department: "",
    skills: "",
    minimum_experience: "",
    maximum_experience: "",
    manager: "",
  });

  // Fill form when selecting a position
  useEffect(() => {
    if (selectedPosition) setFormData(selectedPosition);
  }, [selectedPosition]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add new position
  const handleAdd = async () => {
    try {
      await createPosition(formData);
      alert("Position added successfully!");
      setFormData({});
      refreshPositions();
    } catch (error) {
      console.error("Failed to add position:", error);
    }
  };

  // Update existing position
  const handleUpdate = async () => {
    try {
      if (selectedPosition?.job_id) {
        await updatePosition(selectedPosition.job_id, formData);
        alert("Position updated successfully!");
        refreshPositions();
      }
    } catch (error) {
      console.error("Failed to update position:", error);
    }
  };

  // Delete position
  const handleDelete = async () => {
    try {
      if (selectedPosition?.job_id) {
        await deletePosition(selectedPosition.job_id);
        alert("Position deleted successfully!");
        setFormData({});
        refreshPositions();
      }
    } catch (error) {
      console.error("Failed to delete position:", error);
    }
  };

  return (
    <div className="position-form">
      <h2>Position Details</h2>
      <input name="position" placeholder="Position" value={formData.position} onChange={handleChange} />
      <input name="job_description" placeholder="Job Description" value={formData.job_description} onChange={handleChange} />
      <input name="department" placeholder="Department" value={formData.department} onChange={handleChange} />
      <input name="skills" placeholder="Skills" value={formData.skills} onChange={handleChange} />
      <input name="minimum_experience" placeholder="Min Experience" value={formData.minimum_experience} onChange={handleChange} />
      <input name="maximum_experience" placeholder="Max Experience" value={formData.maximum_experience} onChange={handleChange} />
      <input name="manager" placeholder="HR Manager" value={formData.manager} onChange={handleChange} />

      {/* Button Row */}
      <div className="button-row">
        <button className="add-btn" onClick={handleAdd}>
          Add
        </button>
        <button className="update-btn" onClick={handleUpdate} disabled={!selectedPosition}>
          Update
        </button>
        <button className="delete-btn" onClick={handleDelete} disabled={!selectedPosition}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default PositionForm;
