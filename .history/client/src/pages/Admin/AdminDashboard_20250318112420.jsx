import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Typography } from "antd";
import {
  CheckCircleOutlined,
  FileTextOutlined,
  TeamOutlined,
  SearchOutlined,
  UserSwitchOutlined,
  FileOutlined,
  DatabaseOutlined,
  UserOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Define card data with matching colors
  const dashboardSections = [
    { key: "approvals", icon: <CheckCircleOutlined />, title: "Approvals", color: "#FF6F61" },
    { key: "active-positions", icon: <FileTextOutlined />, title: "Active Positions", color: "#FFD700" },
    { key: "hr-list", icon: <TeamOutlined />, title: "HR's List", color: "#4CAF50" },
    { key: "hr-tracker", icon: <SearchOutlined />, title: "HR Tracker", color: "#4A90E2" },
    { key: "assign-to-hr", icon: <UserSwitchOutlined />, title: "Assign to HR", color: "#FF6F61" },
    { key: "vacancies", icon: <FileOutlined />, title: "Vacancies", color: "#FFD700" },
    { key: "total-data", icon: <DatabaseOutlined />, title: "Total Data", color: "#4CAF50" },
    { key: "active-list", icon: <UserOutlined />, title: "Active List", color: "#4A90E2" },
    { key: "add-new-candidate", icon: <AppstoreAddOutlined />, title: "Add New Candidate", color: "#FF6F61" },
  ];

  // Render each section as a styled card
  const renderSection = (section) => (
    <Col key={section.key} xs={24} sm={12} md={8} lg={6} xl={4} style={{ display: "flex", justifyContent: "center" }}>
      <Card
        hoverable
        style={{
          width: 150,
          height: 150,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: `3px solid ${section.color}`, // Dynamic border color
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          cursor: "pointer",
          transition: "transform 0.2s ease",
          backgroundColor: "#fff",
          textAlign: "center",
        }}
        onClick={() => navigate(`/admin-dashboard/${section.key}`)}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <div style={{ fontSize: "40px", color: "#4A90E2", marginBottom: "8px" }}>{section.icon}</div>
        <h4 style={{ fontSize: "14px", fontWeight: "bold", color: "#333" }}>{section.title}</h4>
      </Card>
    </Col>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Title level={2} style={{ fontWeight: "bold", color: "#333", marginBottom: "20px" }}>
        Admin Credentials
      </Title>

      <Row gutter={[16, 16]} style={{ width: "100%", justifyContent: "center" }}>
        {dashboardSections.map(renderSection)}
      </Row>
    </div>
  );
};

export default AdminDashboard;
