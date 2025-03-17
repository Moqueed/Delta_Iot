import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Typography } from "antd";
import { CheckCircleOutlined, FileTextOutlined, TeamOutlined, SearchOutlined, UserSwitchOutlined, DatabaseOutlined, UserOutlined, AppstoreAddOutlined } from "@ant-design/icons";

const { Title } = Typography;

const AdminDashboard = () => {
  const navigate = useNavigate();

  const adminSections = [
    { key: "approvals", icon: <CheckCircleOutlined />, title: "Approvals", borderColor: "#FF6347" },
    { key: "active-positions", icon: <FileTextOutlined />, title: "Active Positions", borderColor: "#FFD700" },
    { key: "hr-list", icon: <TeamOutlined />, title: "HR's List", borderColor: "#32CD32" },
    { key: "hr-tracker", icon: <SearchOutlined />, title: "HR Tracker", borderColor: "#1E90FF" },
    { key: "assign-to-hr", icon: <UserSwitchOutlined />, title: "Assign to HR", borderColor: "#FF4500" },
  ];

  const renderSection = (section) => (
    <Col key={section.key} xs={24} sm={12} md={6} lg={6} xl={4} style={{ display: "flex", justifyContent: "center" }}>
      <Card
        hoverable
        style={{
          width: 200,
          height: 200,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
          borderRadius: "20px",
          border: `6px solid ${section.borderColor}`,
          padding: "15px",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
        onClick={() => navigate(`/admin-dashboard/${section.key}`)} // ✅ Fixed route
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.3)";
        }}
      >
        <div style={{ fontSize: "50px", marginBottom: "10px", color: "#1890ff" }}>{section.icon}</div>
        <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>{section.title}</h3>
      </Card>
    </Col>
  );

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
      }}
    >
      <Title level={2} style={{ marginBottom: "20px" }}>
        ADMIN CREDENTIALS
      </Title>
      <Row gutter={[32, 32]} style={{ width: "100%", padding: "20px" }} justify="center" align="middle">
        {adminSections.map(renderSection)}
      </Row>
    </div>
  );
};

export default AdminDashboard;
