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
  UploadOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const AdminDashboard = () => {
  const navigate = useNavigate();

  const hrCredentials = [
    { key: "vacancies", icon: <FileOutlined />, title: "Vacancies" },
    { key: "total-data", icon: <DatabaseOutlined />, title: "Total Data" },
    { key: "active-list", icon: <UserOutlined />, title: "Active List" },
    { key: "add-candidate", icon: <AppstoreAddOutlined />, title: "Add New Candidate" },
    { key: "upload", icon: <UploadOutlined />, title: "Upload Data" },
  ];

  const adminCredentials = [
    { key: "approvals", icon: <CheckCircleOutlined />, title: "Approvals" },
    { key: "active-positions", icon: <FileTextOutlined />, title: "Active Positions" },
    { key: "hr-list", icon: <TeamOutlined />, title: "HR's List" },
    { key: "hr-tracker", icon: <SearchOutlined />, title: "HR Tracker" },
    { key: "assign-to-hr", icon: <UserSwitchOutlined />, title: "Assign to HR" },
  ];

  const renderSection = (section) => (
    <Col key={section.key} xs={24} sm={12} md={8} lg={4} style={{ display: "flex", justifyContent: "center" }}>
      <Card
        hoverable
        style={{
          width: 150,
          height: 150,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5dc",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
          borderRadius: "10px",
          padding: "10px",
          cursor: "pointer",
          textAlign: "center",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
        onClick={() => navigate(`/admin-dashboard/${section.key}`)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.3)";
        }}
      >
        <div style={{ fontSize: "50px", marginBottom: "5px", color: "#1890ff" }}>{section.icon}</div>
        <h4 style={{ fontSize: "16px", fontWeight: "bold" }}>{section.title}</h4>
      </Card>
    </Col>
  );

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        padding: "20px",
        backgroundColor: "#fdf6e3",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <Title level={2} style={{ marginBottom: "10px", fontWeight: "bold", color: "#333" }}>
        ADMIN DASHBOARD
      </Title>

      {/* HR's Credentials Section */}
      <Title level={4} style={{ marginBottom: "10px", color: "#555" }}>
        HR'S CREDENTIALS
      </Title>
      <Row gutter={[16, 16]} style={{ width: "100%", justifyContent: "center", marginBottom: "20px" }}>
        {hrCredentials.map(renderSection)}
      </Row>

      {/* Admin Credentials Section */}
      <Title level={4} style={{ marginBottom: "10px", color: "#555" }}>
        ADMIN CREDENTIALS
      </Title>
      <Row gutter={[16, 16]} style={{ width: "100%", justifyContent: "center" }}>
        {adminCredentials.map(renderSection)}
      </Row>
    </div>
  );
};

export default AdminDashboard;
