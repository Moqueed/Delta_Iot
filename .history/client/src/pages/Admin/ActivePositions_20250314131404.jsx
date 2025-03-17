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
    <div style={{ display: "flex" }}>
      {/* Sidebar List */}
      <div style={{ width: "20%", backgroundColor: "#1D4E89", padding: 10 }}>
        <List
          dataSource={positions}
          renderItem={(item) => (
            <List.Item
              style={{ color: "#fff", cursor: "pointer" }}
              onClick={() => setSelectedPosition(item)}
            >
              {item.position}
            </List.Item>
          )}
        />
      </div>

      {/* Position Details */}
      <div style={{ flex: 1, padding: 20 }}>
        <Button type="primary" style={{ marginBottom: 10 }}>ADD +</Button>
        {selectedPosition ? (
          <div>
            <Title level={3}>Position Details</Title>
            <Input addonBefore="Job ID" value={selectedPosition.job_id} disabled />
            <Input addonBefore="Position" value={selectedPosition.position} disabled />
            <Input addonBefore="Job Description" value={selectedPosition.job_description} disabled />
            <Input addonBefore="Department" value={selectedPosition.department} disabled />
            <Input addonBefore="Skills" value={selectedPosition.skills} disabled />
            <Input addonBefore="Min Experience" value={selectedPosition.minimum_experience} disabled />
            <Input addonBefore="Max Experience" value={selectedPosition.maximum_experience} disabled />
            <Input addonBefore="HR Manager" value={selectedPosition.manager} disabled />
            <Button type="primary" danger onClick={() => handleDelete(selectedPosition.job_id)} style={{ marginTop: 10 }}>Delete</Button>
          </div>
        ) : (
          <Title level={4}>Select a position to view details</Title>
        )}
      </div>
    </div>
  );
};

export default ActivePositions;
