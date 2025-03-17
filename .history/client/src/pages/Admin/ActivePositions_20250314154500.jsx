import React, { useEffect, useState } from "react";
import {
  fetchPositions,
  createPosition,
  updatePosition,
  deletePosition,
} from "../../api/activePositions";
import { Button, Input, Typography, List, Select, Row, Col, message } from "antd";

const { Title } = Typography;
const { Option } = Select;

const ActivePositions = () => {
  const [positions, setPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🎯 Fetch positions on load
  useEffect(() => {
    const loadPositions = async () => {
      try {
        const data = await fetchPositions();
        setPositions(data);
      } catch (error) {
        message.error("Failed to fetch positions.");
      } finally {
        setLoading(false);
      }
    };

    loadPositions();
  }, []);

  // 🎯 Handle position selection
  const handleSelectPosition = (position) => setSelectedPosition(position);

  // 🎯 Handle field updates
  const handleFieldChange = (field, value) => {
    setSelectedPosition({ ...selectedPosition, [field]: value });
  };

  // 🎯 Save position updates
  const handleSave = async () => {
    try {
      await updatePosition(selectedPosition.job_id, selectedPosition);
      setPositions((prev) =>
        prev.map((pos) => (pos.job_id === selectedPosition.job_id ? selectedPosition : pos))
      );
      message.success("Position updated successfully!");
    } catch (error) {
      message.error("Failed to update position.");
    }
  };

  // 🎯 Delete a position
  const handleDelete = async (id) => {
    try {
      await deletePosition(id);
      setPositions(positions.filter((pos) => pos.job_id !== id));
      setSelectedPosition(null);
      message.success("Position deleted!");
    } catch (error) {
      message.error("Error deleting position.");
    }
  };

  if (loading) return <Title level={3}>Loading positions...</Title>;

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* Left Side: Positions List */}
      <div style={{ width: "20%", backgroundColor: "#1D4E89", padding: "10px" }}>
        <List
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
                display: "flex",
                justifyContent: "space-between",
              }}
              onClick={() => handleSelectPosition(item)}
            >
              <div>
                {item.position}
                <div style={{ fontSize: "12px", opacity: 0.8 }}>
                  {item.minimum_experience} - {item.maximum_experience} years
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>

      {/* Right Side: Position Details */}
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
              onChange={(e) => handleFieldChange("position", e.target.value)}
              style={{ marginBottom: "10px" }}
            />

            <Row gutter={8} style={{ marginBottom: "10px" }}>
              <Col span={8}>
                <Input addonBefore="Department" readOnly style={{ textAlign: "right" }} />
              </Col>
              <Col span={16}>
                <Select
                  style={{ width: "100%" }}
                  value={selectedPosition.department}
                  onChange={(value) => handleFieldChange("department", value)}
                >
                  <Option value="IT">IT</Option>
                  <Option value="EMDB">EMDB</Option>
                  <Option value="HIGH">HIGH</Option>
                  <Option value="Financial">Financial</Option>
                  <Option value="Python">Python</Option>
                </Select>
              </Col>
            </Row>

            <Input
              addonBefore="Skills"
              value={selectedPosition.skills}
              onChange={(e) => handleFieldChange("skills", e.target.value)}
              style={{ marginBottom: "10px" }}
            />

            {/* Experience Fields */}
            <Row gutter={8} style={{ marginBottom: "10px" }}>
              <Col span={8}>
                <Input addonBefore="Min Exp" style={{ textAlign: "right" }} />
              </Col>
              <Col span={16}>
                <Select
                  style={{ width: "100%" }}
                  value={selectedPosition.minimum_experience}
                  onChange={(value) => handleFieldChange("minimum_experience", value)}
                >
                  {[...Array(11).keys()].map((num) => (
                    <Option key={num} value={num}>
                      {num} years
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>

            <Row gutter={8} style={{ marginBottom: "10px" }}>
              <Col span={8}>
                <Input addonBefore="Max Exp" style={{ textAlign: "right" }} />
              </Col>
              <Col span={16}>
                <Select
                  style={{ width: "100%" }}
                  value={selectedPosition.maximum_experience}
                  onChange={(value) => handleFieldChange("maximum_experience", value)}
                >
                  {[...Array(11).keys()].map((num) => (
                    <Option key={num} value={num}>
                      {num} years
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>

            {/* Save & Delete Buttons */}
            <Button type="primary" onClick={handleSave} style={{ marginRight: "10px" }}>
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
