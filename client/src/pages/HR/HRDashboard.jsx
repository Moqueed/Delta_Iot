import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, Row, Col, Typography, Button, message } from "antd";
import {
  FileOutlined,
  DatabaseOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  FileTextOutlined,
  HomeOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "./HRDashboard.css"; // CSS file

const { Title } = Typography;

const HRDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout successfully");
    window.location.href = "/login";
  };

  const sections = [
    { key: "vacancies", icon: <FileOutlined />, title: "Vacancies", borderColor: "#FFD700" },
    { key: "total-data", icon: <DatabaseOutlined />, title: "Total Data", borderColor: "#32CD32" },
    { key: "active-list", icon: <UserOutlined />, title: "Active List", borderColor: "#1E90FF" },
    { key: "add-candidate", icon: <AppstoreAddOutlined />, title: "Add New Candidate", borderColor: "#FF4500" },
    { key: "upload", icon: <FileTextOutlined />, title: "Upload", borderColor: "#32CD32" },
  ];

  return (
    <div className="hr-dashboard-container">
      {/* Header */}
      <div className="hr-dashboard-header">
        <div className="header-left">
          <img src="/logo.png" alt="logo" className="logo" />
          <Link to="/hr-dashboard">
            <HomeOutlined className="home-icon" />
          </Link>
        </div>

        <h2>HR Dashboard</h2>

        <div className="header-right">
          <span className="welcome-text">Welcome: Moqueed Ahmed</span>
          <Button
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            type="primary"
            danger
            size="small"
            style={{ marginLeft: "15px" }}
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Title */}
      {/* <Title level={2} className="dashboard-title">
        HR's CREDENTIALS
      </Title> */}

      {/* Cards */}
      <div className="dashboard-body">
      <Row gutter={[32, 32]} className="card-row">
        {sections.map((section) => (
          <Col key={section.key} xs={24} sm={12} md={6} lg={6} xl={6} className="card-col">
            <Card
              hoverable
              className="dashboard-card"
              style={{ border: `8px solid ${section.borderColor}` }}
              onClick={() => navigate(section.key === "total-data" ? "/total-data" : `/hr-dashboard/${section.key}`)}
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
        ))}
      </Row>
      </div>
    </div>
  );
};

export default HRDashboard;
