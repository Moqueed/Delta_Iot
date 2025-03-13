import React from "react";
import { Card, Typography } from "antd";

const { Title } = Typography;

const TotalDataPage = () => {
  const sections = [
    { title: "Total Master Data", color: "#ADD8E6" },
    { title: "Newly Joined Employees", color: "#C1E1C1" },
    { title: "About to Join", color: "#FFECB3" },
    { title: "Buffer Data", color: "#D8BFD8" },
    { title: "Rejected Data", color: "#FFB6C1" },
  ];

  const cardStyle = {
    width: "220px",
    height: "120px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        gap: "20px",
      }}
    >
      <Title level={2} style={{ marginBottom: "20px" }}>
        Total Data Overview
      </Title>

      <div style={{ display: "flex", gap: "20px" }}>
        <Card style={{ ...cardStyle, backgroundColor: sections[0].color }}>
          {sections[0].title}
        </Card>
        <Card style={{ ...cardStyle, backgroundColor: sections[1].color }}>
          {sections[1].title}
        </Card>
      </div>

      <Card style={{ ...cardStyle, backgroundColor: sections[2].color }}>
        {sections[2].title}
      </Card>

      <div style={{ display: "flex", gap: "20px" }}>
        <Card style={{ ...cardStyle, backgroundColor: sections[3].color }}>
          {sections[3].title}
        </Card>
        <Card style={{ ...cardStyle, backgroundColor: sections[4].color }}>
          {sections[4].title}
        </Card>
      </div>
    </div>
  );
};

export default TotalDataPage;
