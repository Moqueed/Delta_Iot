import React, { useEffect, useState } from "react";
import { Button, Input, Typography, List, Select, Row, Col, message } from "antd";
import { fetchPositions, createPosition, updatePosition, deletePosition } from "../../api/activePositions";

const { Title } = Typography;
const { Option } = Select;

const ActivePositions = () => {
  const [positions, setPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch positions on mount
  useEffect(() => {
    const loadPositions = async () => {
      setLoading(true);
      try {
        const data = await fetchPositions();
        setPositions(data);
      } catch (error) {
        console.error("Error fetching positions:", error);
        message.error("Failed to load positions");
      }
      setLoading(false);
    };
    loadPositions();
  }, []);

  // Handle creating a new position
  const handleAddPosition = async () => {
    const newPosition = { position: "New Position", department: "IT", vacancy: 1 };
    try {
      const addedPosition = await createPosition(newPosition);
      setPositions([...positions, addedPosition]);
      message.success("Position added successfully");
    } catch (error) {
      console.error("Error creating position:", error);
      message.error("Failed to add position");
    }
  };

  // Handle updating the selected position
  const handleUpdate = async (updatedPosition) => {
    try {
      const updatedData = await updatePosition(updatedPosition.job_id, updatedPosition);
      setPositions(
        positions.map((pos) => (pos.job_id === updatedData.job_id ? updatedData : pos))
      );
      setSelectedPosition(updatedData);
      message.success("Position updated successfully");
    } catch (error) {
      console.error("Error updating position:", error);
      message.error("Failed to update position");
    }
  };

  // Handle deleting a position
  const handleDelete = async (id) => {
    try {
      await deletePosition(id);
      setPositions(positions.filter((pos) => pos.job_id !== id));
      setSelectedPosition(null);
      message.success("Position deleted successfully");
    } catch (error) {
      console.error("Error deleting position:", error);
      message.error("Failed to delete position");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* Left side: Positions list */}
      <div style={{ width: "20%", backgroundColor: "#1D4E89", padding: "10px" }}>
        <Button type="primary" onClick={handleAddPosition} style={{ width: "100%", marginBottom: "10px" }}>
          + Add Position
        </Button>
        <List
          loading={loading}
          dataSource={positions}
          renderItem={(item) => (
            <List.Item
              style={{
                backgroundColor: selectedPosition?.job_id === item.job_id ? "#ffffff" : "#3a5ba0",
                color: selectedPosition?.job_id === item.job_id ? "#000" : "#ffffff",
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
            <Input
              addonBefore="Job ID"
              value={selectedPosition.job_id}
              disabled
              style={{ marginBottom: "10px" }}
            />
            <Input
              addonBefore="Position"
              value={selectedPosition.position}
              style={{ marginBottom: "10px" }}
              onChange={(e) =>
                setSelectedPosition({ ...selectedPosition, position: e.target.value })
              }
            />

            <Input
              addonBefore="Skills"
              value={selectedPosition.skills}
              style={{ marginBottom: "10px" }}
              onChange={(e) =>
                setSelectedPosition({ ...selectedPosition, skills: e.target.value })
              }
            />

            <Row gutter={8} style={{ marginBottom: "10px" }}>
              <Col span={12}>
                <Input addonBefore="Vacancy" value={selectedPosition.vacancy} />
              </Col>
              <Col span={12}>
                <Select
                  style={{ width: "100%" }}
                  value={selectedPosition.department}
                  onChange={(value) =>
                    setSelectedPosition({ ...selectedPosition, department: value })
                  }
                >
                  <Option value="IT">IT</Option>
                  <Option value="EMDB">EMDB</Option>
                  <Option value="HIGH">HIGH</Option>
                  <Option value="Financial">Financial</Option>
                  <Option value="Python">Python</Option>
                </Select>
              </Col>
            </Row>

            <Button
              type="primary"
              onClick={() => handleUpdate(selectedPosition)}
              style={{ marginRight: "10px" }}
            >
              Save Changes
            </Button>

            <Button type="primary" danger onClick={() => handleDelete(selectedPosition.job_id)}>
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
