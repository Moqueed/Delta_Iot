import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Typography } from "antd";
import {
  CheckCircleOutlined,
  FileTextOutlined,
  TeamOutlined,
  SearchOutlined,
  UserSwitchOutlined,
  DatabaseOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  FileOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const AdminDashboard = () => {
  const navigate = useNavigate();

  // HR's Credentials sections (Top)
  const hrSections = [
    { key: "vacancies", icon: <FileOutlined />, title: "Vacancies", borderColor: "#FFD700" },
    { key: "total-data", icon: <DatabaseOutlined />, title: "Total Data", borderColor: "#32CD32" },
    { key: "active-list", icon: <UserOutlined />, title: "Active List", borderColor: "#32CD32" },
    { key: "add-candidate", icon: <AppstoreAddOutlined />, title: "Add New Candidate", borderColor: "#32CD32" },
    { key: "upload", icon: <FileTextOutlined />, title: "Upload", borderColor: "#32CD32" },
  ];

  // Admin Credential sections (Bottom)
  const adminSections = [
    { key: "approvals", icon: <CheckCircleOutlined />, title: "Approvals", borderColor: "#FF6347" },
    { key: "active-positions", icon: <FileTextOutlined />, title: "Active Positions", borderColor: "#FFD700" },
    { key: "hr-list", icon: <TeamOutlined />, title: "HR's List", borderColor: "#32CD32" },
    { key: "hr-data-tracker", icon: <SearchOutlined />, title: "HR Tracker", borderColor: "#1E90FF" },
    { key: "assign-to-hr", icon: <UserSwitchOutlined />, title: "Assign to HR", borderColor: "#FF4500" },
  ];

  // Card Renderer
  const renderSection = (section) => (
    <Col key={section.key} xs={24} sm={12} md={8} lg={6} xl={4} style={{ display: "flex", justifyContent: "center" }}>
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
        onClick={() => {
          const routeMap = {
            "total-data": "/total-data",
            "active-positions": "/admin-dashboard/active-positions",
            "approvals": "/admin-dashboard/approvals",
            "active-list": "/admin-dashboard/active-list",
            "hr-list": "/admin-dashboard/hr-list",
            "assign-to-hr": "/admin-dashboard/assign-to-hr",
            "hr-data-tracker" : "/admin-dashboard/hr-data-tracker",
          };
        
          navigate(routeMap[section.key] || `/hr-dashboard/${section.key}`);
        }}
        
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
      {/* HR's Credential Section */}
      <Title level={2} style={{ marginBottom: "20px", fontWeight: "bold", color: "#333" }}>
        HR's Credential
      </Title>
      <Row gutter={[32, 32]} style={{ width: "100%", padding: "20px" }} justify="center" align="middle">
        {hrSections.map(renderSection)}
      </Row>

      {/* Admin Credential Section */}
      <Title level={2} style={{ marginTop: "40px", marginBottom: "20px", fontWeight: "bold", color: "#333" }}>
        Admin Credential
      </Title>
      <Row gutter={[32, 32]} style={{ width: "100%", padding: "20px" }} justify="center" align="middle">
        {adminSections.map(renderSection)}
      </Row>
    </div>
  );
};

export default AdminDashboard;
