import React from "react";
import { Card, Typography, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const TotalDataPage = () => {
  const navigate = useNavigate();

  const sections = [
    { title: "Total Master Data", color: "#b3e5fc", route: "/master-data" },
    { title: "Newly Joined Employees", color: "#c8e6c9", route: "/new-employees" },
    { title: "About to Join", color: "#ffecb3", route: "/about-to-join" },
    { title: "Buffer Data", color: "#d1c4e9", route: "/buffer-data" },
    { title: "Rejected Data", color: "#ffcdd2", route: "/rejected-data" },
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <Title level={2}>Total Data Overview</Title>

      <Row justify="center" gutter={[16, 16]}>
        {sections.map((section, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <Card
              hoverable
              onClick={() => handleCardClick(section.route)}
              style={{
                background: section.color,
                borderRadius: 10,
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              <Title level={4} style={{ marginBottom: 0 }}>{section.title}</Title>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TotalDataPage;
