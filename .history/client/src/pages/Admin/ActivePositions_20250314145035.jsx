import React, { useEffect, useState } from "react";
import { deletePosition, fetchPositions } from "../../api/activePositions";
import { Button, Input, Typography, List, Select, Row, Col } from "antd";

const { Title } = Typography;
const { Option } = Select;

const ActivePositions = () => {
  const [positions, setPositions] = useState([
    { job_id: 1, position: "Python Developer" },
    { job_id: 2, position: "EMD Developer" },
    { job_id: 3, position: "Intern" },
    { job_id: 4, position: "Trainee" },
    { job_id: 5, position: "C++ Developer" },
    { job_id: 6, position: "Accounts" },
    { job_id: 7, position: "Developer" },
  ]);
  const [selectedPosition, setSelectedPosition] = useState(null);

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
            <Row gutter={8} style={{ marginBottom: "10px" }}>
              <Col span={8}>
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
              <Col span={16}>
                <Input value={selectedPosition.department} readOnly style={{ textAlign: "right" }} />
              </Col>
            </Row>
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
