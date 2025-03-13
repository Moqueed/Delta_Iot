import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col } from "antd";
import { FileOutlined, DatabaseOutlined, UserOutlined, AppstoreAddOutlined } from "@ant-design/icons";

const HRDashboard = () => {
  const navigate = useNavigate();

  const sections = [
    { key: "vacancies", icon: <FileOutlined />, title: "Vacancies", borderColor: "#FFD700" },
    { key: "total-data", icon: <DatabaseOutlined />, title: "Total Data", borderColor: "#32CD32" },
    { key: "active-list", icon: <UserOutlined />, title: "Active List", borderColor: "#1E90FF" },
    { key: "add-candidate", icon: <AppstoreAddOutlined />, title: "Add New Candidate", borderColor: "#FF4500" },
  ];

  return (
    <div style={{ height: "100vh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f5f5f5" }}>
      <Row gutter={[32, 32]} style={{ width: "100%", padding: "20px" }} justify="center" align="middle">
        {sections.map((section) => (
          <Col key={section.key} xs={24} sm={12} md={6} lg={6} xl={6} style={{ display: "flex", justifyContent: "center" }}>
            <Card
              hoverable
              style={{
                width: 350,
                height: 350,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                borderRadius: "20px",
                border: `8px solid ${section.borderColor}`,
                padding: "20px",
              }}
              onClick={() => navigate(`/${section.key}`)}
            >
              <div style={{ fontSize: "100px", marginBottom: "20px", color: "#1890ff" }}>{section.icon}</div>
              <h3 style={{ fontSize: "28px", fontWeight: "bold" }}>{section.title}</h3>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HRDashboard;
