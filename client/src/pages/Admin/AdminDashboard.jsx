import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, Row, Col, Typography, Button, message} from "antd";
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
  LogoutOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import "./AdminDashboard.css";

const { Title } = Typography;

const AdminDashboard = () => {
  const navigate = useNavigate();

   const handleLogout = () => {
    localStorage.clear();
    message.success("Logout successfully");
    window.location.href = "/login";
  };

  const hrSections = [
    { key: "vacancies", icon: <FileOutlined />, title: "Vacancies", borderColor: "#FFD700" },
    { key: "total-data", icon: <DatabaseOutlined />, title: "Total Data", borderColor: "#32CD32" },
    { key: "active-list", icon: <UserOutlined />, title: "Active List", borderColor: "#32CD32" },
    { key: "add-candidate", icon: <AppstoreAddOutlined />, title: "Add New Candidate", borderColor: "#32CD32" },
    { key: "upload", icon: <FileTextOutlined />, title: "Upload", borderColor: "#32CD32" },
  ];

  const adminSections = [
    { key: "approvals", icon: <CheckCircleOutlined />, title: "Approvals", borderColor: "#FF6347" },
    { key: "active-positions", icon: <FileTextOutlined />, title: "Active Positions", borderColor: "#FFD700" },
    { key: "hr-list", icon: <TeamOutlined />, title: "HR's List", borderColor: "#32CD32" },
    { key: "hr-data-tracker", icon: <SearchOutlined />, title: "HR Tracker", borderColor: "#1E90FF" },
    { key: "assign-to-hr", icon: <UserSwitchOutlined />, title: "Assign to HR", borderColor: "#FF4500" },
  ];

  const renderSection = (section) => (
    <Col key={section.key} xs={24} sm={12} md={8} lg={6} xl={4} className="dashboard-card-col">
      <Card
        hoverable
        className="dashboard-card"
        style={{ borderColor: section.borderColor }}
        onClick={() => {
          const routeMap = {
            "total-data": "/total-data",
            "active-positions": "/admin-dashboard/active-positions",
            "approvals": "/admin-dashboard/approvals",
            "active-list": "/admin-dashboard/active-list",
            "hr-list": "/admin-dashboard/hr-list",
            "assign-to-hr": "/admin-dashboard/assign-to-hr",
            "hr-data-tracker": "/admin-dashboard/hr-data-tracker",
            "upload": "/admin-dashboard/upload",
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
        <div className="card-icon">{section.icon}</div>
        <h3 className="card-title">{section.title}</h3>
      </Card>
    </Col>
  );

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <img src="/images/hrms-logo.jpg" alt="logo" className="logo" />
        </div>
        <h2 className="header-title">Admin Dashboard</h2>
        <div className="header-right">
          <span className="welcome-text">Welcome: Moqueed Ahmed</span>
          <Button
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            type="primary"
            danger
            size="small"
            className="logout-button"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="dashboard-body">
        {/* HR Section */}
        <Title level={2} className="section-title">
          HR's Credential
        </Title>
        <Row gutter={[32, 32]} className="dashboard-row">
          {hrSections.map(renderSection)}
        </Row>

        {/* Admin Section */}
        <Title level={2} className="section-title">
          Admin Credential
        </Title>
        <Row gutter={[32, 32]} className="dashboard-row">
          {adminSections.map(renderSection)}
        </Row>
      </div>
    </div>
  );
};

export default AdminDashboard;
