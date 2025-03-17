import React, { useEffect, useState } from "react";
import { deletePosition, fetchPositions } from "../../api/activePositions";
import { Button, Input, Typography, List } from "antd";

const { Title } = Typography;

const ActivePositions = () => {
  const [positions, setPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);

  useEffect(() => {
    const loadPositions = async () => {
      try {
        const data = await fetchPositions();
        setPositions(data);
      } catch (error) {
        console.error("Failed to fetch positions", error);
      }
    };
    loadPositions();
  }, []);

  const handleAddPosition = () => {
    const newPosition = {
      job_id: positions.length + 1,
      position: "New Position",
      job_description: "",
      department: "",
      skills: "",
      minimum_experience: "",
      maximum_experience: "",
      manager: "",
    };
    setPositions([...positions, newPosition]);
    setSelectedPosition(newPosition);
  };

  const handleDelete = async (id) => {
    try {
      await deletePosition(id);
      setPositions(positions.filter((pos) => pos.job_id !== id));
      setSelectedPosition(null);
    } catch (error) {
      console.error("Error deleting position", error);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left side: Positions list */}
      <div style={{ width: "20%", backgroundColor: "#1D4E89", padding: "10px" }}>
        <Button type="primary" style={{ marginBottom: "10px" }} onClick={handleAddPosition}>
          ADD +
        </Button>
        <List
          dataSource={positions}
          renderItem={(item) => (
            <List.Item
              style={{
                backgroundColor: selectedPosition === item ? "#ffffff" : "#3a5ba0",
                color: selectedPosition === item ? "#000" : "#ffffff",
                padding: "10px",
                cursor: "pointer",
                marginBottom: "5px",
                borderRadius: "5px",
              }}
              onClick={() => setSelectedPosition(item)}
            >
              {item.position}
            </List.Item>
          )}
        />
      </div>

      {/* Right side: Position details form */}
      <div style={{ flex: 1, padding: "20px", backgroundColor: "#f0f2f5" }}>
        {selectedPosition ? (
          <>
            <Title level={3}>Position Details</Title>
            <Input addonBefore="Job ID" value={selectedPosition.job_id} disabled style={{ marginBottom: "10px" }} />
            <Input addonBefore="Position" value={selectedPosition.position} style={{ marginBottom: "10px" }} />
            <Input addonBefore="Job Description" value={selectedPosition.job_description} style={{ marginBottom: "10px" }} />
            <Input addonBefore="Department" value={selectedPosition.department} style={{ marginBottom: "10px" }} />
            <Input addonBefore="Skills" value={selectedPosition.skills} style={{ marginBottom: "10px" }} />
            <Input addonBefore="Min Experience" value={selectedPosition.minimum_experience} style={{ marginBottom: "10px" }} />
            <Input addonBefore="Max Experience" value={selectedPosition.maximum_experience} style={{ marginBottom: "10px" }} />
            <Input addonBefore="HR Manager" value={selectedPosition.manager} style={{ marginBottom: "10px" }} />
            <Button type="primary" danger onClick={() => handleDelete(selectedPosition.job_id)} style={{ marginTop: "10px" }}>
              Delete
            </Button>
          </>
        ) : (
          <Title level={4}>Select a position to view details</Title>
        )}
      </div>
    </div>
  );
};

export default ActivePositions;
