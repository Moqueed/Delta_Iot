import React, { useEffect, useState } from "react";
import { fetchPositions, deletePosition, updatePosition } from "../../api/activePositions";
import { Button, Input, Typography, List, Select, Row, Col, message, Spin } from "antd";

const { Title } = Typography;
const { Option } = Select;

const ActivePositions = () => {
  const [positions, setPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch positions from the backend
  useEffect(() => {
    const loadPositions = async () => {
      try {
        const data = await fetchPositions();
        setPositions(data);
      } catch (error) {
        message.error("Failed to load positions.");
      } finally {
        setLoading(false);
      }
    };
    loadPositions();
  }, []);

  // Handle position deletion
  const handleDelete = async (id) => {
    try {
      await deletePosition(id);
      setPositions(positions.filter((pos) => pos.job_id !== id));
      setSelectedPosition(null);
      message.success("Position deleted successfully!");
    } catch (error) {
      message.error("Error deleting position");
    }
  };

  // Handle position update
  const handleSave = async () => {
    if (!selectedPosition) return;

    setSaving(true);
    try {
      await updatePosition(selectedPosition.job_id, selectedPosition);
      const updatedList = positions.map((pos) => (pos.job_id === selectedPosition.job_id ? selectedPosition : pos));
      setPositions(updatedList);
      message.success("Position updated successfully!");
    } catch (error) {
      message.error("Error updating position");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spin tip="Loading positions..." style={{ width: "100%", marginTop: "20%" }} />;

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* Left side: Positions list */}
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
            <Input
              addonBefore="Position"
              value={selectedPosition.position}
              onChange={(e) => setSelectedPosition({ ...selectedPosition, position: e.target.value })}
              style={{ marginBottom: "10px" }}
            />
            <Row gutter={8} style={{ marginBottom: "10px" }}>
              <Col span={8}>
                <Input addonBefore="Department" value={selectedPosition.department} readOnly style={{ textAlign: "right" }} />
              </Col>
              <Col span={16}>
                <Select
                  style={{ width: "100%" }}
                  value={selectedPosition.department}
                  onChange={(value) => setSelectedPosition({ ...selectedPosition, department: value })}
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
              onChange={(e) => setSelectedPosition({ ...selectedPosition, skills: e.target.value })}
              style={{ marginBottom: "10px" }}
            />

            <Row gutter={8} style={{ marginBottom: "10px" }}>
              <Col span={8}>
                <Input addonBefore="Min Experience" style={{ textAlign: "right" }} />
              </Col>
              <Col span={16}>
                <Select
                  style={{ width: "100%" }}
                  value={selectedPosition.minimum_experience}
                  onChange={(value) => setSelectedPosition({ ...selectedPosition, minimum_experience: value })}
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
                <Input addonBefore="Max Experience" style={{ textAlign: "right" }} />
              </Col>
              <Col span={16}>
                <Select
                  style={{ width: "100%" }}
                  value={selectedPosition.maximum_experience}
                  onChange={(value) => setSelectedPosition({ ...selectedPosition, maximum_experience: value })}
                >
                  {[...Array(11).keys()].map((num) => (
                    <Option key={num} value={num}>
                      {num} years
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>

            <Button type="primary" onClick={handleSave} loading={saving} style={{ marginRight: "10px" }}>
              Save Changes
            </Button>
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
