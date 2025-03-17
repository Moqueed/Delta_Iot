import React, { useEffect, useState } from "react";

import { Button, Input, Table, message } from "antd";
import { createPosition, deletePosition, fetchPositions, updatePosition } from "../../api/activePositions";

const ActivePositions = () => {
  const [positions, setPositions] = useState([]);
  const [newPosition, setNewPosition] = useState({
    position: "",
    skills: "",
    department: "",
    vacancy: 0,
    manager: "",
    minimum_experience: 0,
    maximum_experience: 0,
    job_description: "",
    HRs: "",
  });

  // Fetch positions on load
  useEffect(() => {
    loadPositions();
  }, []);

  const loadPositions = async () => {
    try {
      const data = await fetchPositions();
      setPositions(data);
    } catch (error) {
      message.error("Failed to load positions.");
    }
  };

  // Handle submit for new position
  const handleSubmit = async () => {
    try {
      const data = await createPosition(newPosition);
      message.success("Position created successfully!");
      setPositions([...positions, data]);
      setNewPosition({
        position: "",
        skills: "",
        department: "",
        vacancy: 0,
        manager: "",
        minimum_experience: 0,
        maximum_experience: 0,
        job_description: "",
        HRs: "",
      });
    } catch (error) {
      message.error("Failed to create position.");
    }
  };

  // Handle updating a position
  const handleUpdate = async (id) => {
    try {
      const updatedData = { ...newPosition, position: "Updated Position" };
      await updatePosition(id, updatedData);
      message.success("Position updated successfully!");
      loadPositions(); // Refresh list
    } catch (error) {
      message.error("Failed to update position.");
    }
  };

  // Handle deleting a position
  const handleDelete = async (id) => {
    try {
      await deletePosition(id);
      message.success("Position deleted successfully!");
      setPositions(positions.filter((pos) => pos.job_id !== id));
    } catch (error) {
      message.error("Failed to delete position.");
    }
  };

  return (
    <div>
      <h2>Active Positions</h2>

      <Input
        placeholder="Position"
        value={newPosition.position}
        onChange={(e) => setNewPosition({ ...newPosition, position: e.target.value })}
        style={{ width: 200, marginRight: 10 }}
      />
      <Button type="primary" onClick={handleSubmit}>
        Add Position
      </Button>

      <Table
        dataSource={positions}
        columns={[
          { title: "Position", dataIndex: "position", key: "position" },
          { title: "Department", dataIndex: "department", key: "department" },
          { title: "Vacancy", dataIndex: "vacancy", key: "vacancy" },
          {
            title: "Actions",
            render: (_, record) => (
              <>
                <Button type="link" onClick={() => handleUpdate(record.job_id)}>
                  Edit
                </Button>
                <Button type="link" danger onClick={() => handleDelete(record.job_id)}>
                  Delete
                </Button>
              </>
            ),
          },
        ]}
        rowKey="job_id"
      />
    </div>
  );
};

export default ActivePositions;
