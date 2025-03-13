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
    width: "260px",
    height: "160px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "15px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
    fontWeight: "bold",
    fontSize: "24px",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  const handleHover = (e) => {
    e.currentTarget.style.transform = "scale(1.1)";
    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.5)";
  };

  const handleLeave = (e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.3)";
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
        backgroundColor: "#ffffff",
        gap: "50px",
        overflow: "hidden",
      }}
    >
      <Title level={1} style={{ marginBottom: "30px", fontSize: "50px" }}>
        Total Data Overview
      </Title>

      <div style={{ display: "flex", gap: "50px" }}>
        <Card
          style={{ ...cardStyle, backgroundColor: sections[0].color }}
          onMouseEnter={handleHover}
          onMouseLeave={handleLeave}
        >
          {sections[0].title}
        </Card>
        <Card
          style={{ ...cardStyle, backgroundColor: sections[1].color }}
          onMouseEnter={handleHover}
          onMouseLeave={handleLeave}
        >
          {sections[1].title}
        </Card>
      </div>

      <Card
        style={{ ...cardStyle, backgroundColor: sections[2].color }}
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
      >
        {sections[2].title}
      </Card>

      <div style={{ display: "flex", gap: "50px" }}>
        <Card
          style={{ ...cardStyle, backgroundColor: sections[3].color }}
          onMouseEnter={handleHover}
          onMouseLeave={handleLeave}
        >
          {sections[3].title}
        </Card>
        <Card
          style={{ ...cardStyle, backgroundColor: sections[4].color }}
          onMouseEnter={handleHover}
          onMouseLeave={handleLeave}
        >
          {sections[4].title}
        </Card>
      </div>
    </div>
  );
};

export default TotalDataPage;