import React from "react";
import { Card, Typography } from "antd";
import { DatabaseOutlined, UserAddOutlined, CalendarOutlined, ClockCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const TotalDataPage = () => {
  const sections = [
    { title: "Total Master Data", color: "#ADD8E6", icon: <DatabaseOutlined style={{ fontSize: "50px", color: "#0056b3" }} /> },
    { title: "Newly Joined", color: "#C1E1C1", icon: <UserAddOutlined style={{ fontSize: "50px", color: "#2E8B57" }} /> },
    { title: "About to Join", color: "#FFECB3", icon: <CalendarOutlined style={{ fontSize: "50px", color: "#FFA500" }} /> },
    { title: "Buffer Data", color: "#D8BFD8", icon: <ClockCircleOutlined style={{ fontSize: "50px", color: "#6A5ACD" }} /> },
    { title: "Rejected Data", color: "#FFB6C1", icon: <CloseCircleOutlined style={{ fontSize: "50px", color: "#DC143C" }} /> },
  ];

  const navigate = useNavigate();

  const handleCardClick = (section) => {
    if(section.title === "Rejected Data"){
      navigate("/total-data/rejected-data");
    } else if(section.title === "Total Master Data"){
      navigate("/total-data/total-master-data");
    } else if(section.title === "About to Join"){
      navigate("/total-data/about-to-join");
    } else if(section.title === "Newly Joined"){
      navigate("/total-data/newly-joined")
    } else if(section.title === "Buffer Data"){
      navigate("/total-data/buffer-data")
    }
  };

  const cardStyle = {
    width: "180px",
    height: "140px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "15px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
    fontWeight: "bold",
    fontSize: "18px",
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
        gap: "20px",
        overflow: "hidden",
      }}
    >
      <Title level={1} style={{ marginBottom: "20px", fontSize: "60px" }}>
        Total Data
      </Title>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr 1fr",
        gap: "40px",
        justifyItems: "center",
        alignItems: "center"
      }}>
        <Card
          style={{ ...cardStyle, backgroundColor: sections[0].color }}
          onMouseEnter={handleHover}
          onMouseLeave={handleLeave}
          onClick={() => handleCardClick(sections[0])}
        >
          {sections[0].icon}
          <div style={{ marginTop: "10px" }}>{sections[0].title}</div>
        </Card>
        <Card
          style={{ ...cardStyle, backgroundColor: sections[1].color }}
          onMouseEnter={handleHover}
          onMouseLeave={handleLeave}
          onClick={() => handleCardClick(sections[1])}
        >
          {sections[1].icon}
          <div style={{ marginTop: "10px" }}>{sections[1].title}</div>
        </Card>
        <Card
          style={{ ...cardStyle, backgroundColor: sections[2].color, gridColumn: "1 / 3" }}
          onMouseEnter={handleHover}
          onMouseLeave={handleLeave}
          onClick={() => handleCardClick(sections[2])}
        >
          {sections[2].icon}
          <div style={{ marginTop: "10px" }}>{sections[2].title}</div>
        </Card>
        <Card
          style={{ ...cardStyle, backgroundColor: sections[3].color }}
          onMouseEnter={handleHover}
          onMouseLeave={handleLeave}
          onClick={() => handleCardClick(sections[3])}
        >
          {sections[3].icon}
          <div style={{ marginTop: "10px" }}>{sections[3].title}</div>
        </Card>
        <Card
          style={{ ...cardStyle, backgroundColor: sections[4].color }}
          onMouseEnter={handleHover}
          onMouseLeave={handleLeave}
          onClick={() => handleCardClick(sections[4])}
        >
          {sections[4].icon}
          <div style={{ marginTop: "10px" }}>{sections[4].title}</div>
        </Card>
      </div>
    </div>
  );
};

export default TotalDataPage;
