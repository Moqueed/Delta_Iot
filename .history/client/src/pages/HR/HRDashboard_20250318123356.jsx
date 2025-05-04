import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Typography } from "antd";
import { FileOutlined, DatabaseOutlined, UserOutlined, AppstoreAddOutlined } from "@ant-design/icons";

const { Title } = Typography;

const HRDashboard = () => {
  const navigate = useNavigate();

  const sections = [
    { key: "vacancies", icon: <FileOutlined />, title: "Vacancies", borderColor: "#FFD700" },
    { key: "total-data", icon: <DatabaseOutlined />, title: "Total Data", borderColor: "#32CD32" },
    { key: "active-list", icon: <UserOutlined />, title: "Active List", borderColor: "#1E90FF" },
    { key: "add-candidate", icon: <AppstoreAddOutlined />, title: "Add New Candidate", borderColor: "#FF4500" },
  ];

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
        overflow: "hidden", // Prevent scrolling
      }}
    >
      <Title level={2} style={{ marginBottom: "20px", fontWeight: "bold", color: "#333" }}>
        HR's CREDENTIALS
      </Title>

      <Row
        gutter={[32, 32]}
        style={{
          width: "100%",
          maxWidth: "1200px",
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {sections.map((section) => (
          <Col
            key={section.key}
            xs={24}
            sm={12}
            md={6}
            lg={6}
            xl={6}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Card
              hoverable
              style={{
                width: "220px",
                height: "220px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                borderRadius: "20px",
                border: `8px solid ${section.borderColor}`,
                padding: "20px",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer",
              }}
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
              <div style={{ fontSize: "60px", marginBottom: "10px", color: "#1890ff" }}>{section.icon}</div>
              <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>{section.title}</h3>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HRDashboard;
