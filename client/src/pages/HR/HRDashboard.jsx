import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Typography, Button, message } from "antd";
import {
  FileOutlined,
  DatabaseOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  FileTextOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "./HRDashboard.css";
import axiosInstance from "../../api";

const { Title } = Typography;

const HRDashboard = () => {
  const [hrName, setHrName] = useState("");
  const navigate = useNavigate();
  const hrEmail = localStorage.getItem("userEmail");

  // ✅ Redirect if not HR
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "HR") {
      message.error("Unauthorized access!");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // ✅ Fetch HR name
  useEffect(() => {
    const fetchHRDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/hr/email/${hrEmail}`);
        const data = response.data;
        setHrName(data.name || "HR");
      } catch (err) {
        console.error("Failed to fetch HR details", err);
        setHrName("HR");
      }
    };
    if (hrEmail) {
      fetchHRDetails();
    }
  }, [hrEmail]);

  // ✅ Logout using React Router
  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout successfully");
    navigate("/login", { replace: true });
  };

  // ✅ Card sections
  const sections = [
    { key: "vacancies", icon: <FileOutlined />, title: "Vacancies", borderColor: "#FFD700" },
    { key: "total-data", icon: <DatabaseOutlined />, title: "Total Data", borderColor: "#32CD32" },
    { key: "active-list", icon: <UserOutlined />, title: "Active List", borderColor: "#1E90FF" },
    { key: "add-candidate", icon: <AppstoreAddOutlined />, title: "Add New Candidate", borderColor: "#FF4500" },
    { key: "upload", icon: <FileTextOutlined />, title: "Upload", borderColor: "#32CD32" },
  ];

  // ✅ Route mapping
  const routeMap = {
    "vacancies": "/hr-dashboard/vacancies",
    "total-data": "/total-data",
    "active-list": "/hr-dashboard/active-list",
    "add-candidate": "/hr-dashboard/add-candidate",
    "upload": "/hr-dashboard/upload",
  };

  return (
    <div className="hr-dashboard-container">
      {/* Header */}
      <div className="hr-dashboard-header">
        <div className="header-left">
          <img src="/images/hrms-logo.jpg" alt="logo" className="logo" />
        </div>
        <h2>HR Dashboard</h2>
        <div className="header-right">
          <span className="welcome-text">Welcome: {hrName}</span>
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

      {/* Cards */}
      <div className="hr-dashboard-body">
        <Row gutter={[32, 32]} className="card-row">
          {sections.map((section) => (
            <Col
              key={section.key}
              xs={24}
              sm={12}
              md={6}
              lg={6}
              xl={6}
              className="card-col"
            >
              <Card
                hoverable
                className="hr-dashboard-card"
                style={{ border: `8px solid ${section.borderColor}` }}
                onClick={() =>
                  navigate(routeMap[section.key] || "/unauthorized")
                }
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 20px rgba(0, 0, 0, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 10px rgba(0, 0, 0, 0.3)";
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
