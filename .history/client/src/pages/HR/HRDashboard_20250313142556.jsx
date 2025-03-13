import React from "react";
import { Layout, Card, Row, Col } from "antd";
import { FileOutlined, UserOutlined, AppstoreAddOutlined, DatabaseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header, Content } = Layout;

const HRDashboard = () => {
  const navigate = useNavigate();

  const sections = [
    { title: "Vacancies", icon: <FileOutlined />, route: "/vacancies" },
    { title: "Total Data", icon: <DatabaseOutlined />, route: "/total-data" },
    { title: "Active List", icon: <UserOutlined />, route: "/active-list" },
    { title: "Add New Candidate", icon: <AppstoreAddOutlined />, route: "/add-candidate" },
  ];

  const handleNavigate = (route) => navigate(route);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ background: "#fff", textAlign: "center", fontSize: "20px" }}>HR Credential Dashboard</Header>
      <Content style={{ padding: "20px" }}>
        <Row gutter={[16, 16]} justify="center">
          {sections.map((section, index) => (
            <Col key={index} xs={24} sm={12} md={6}>
              <Card
                hoverable
                style={{ textAlign: "center", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
                onClick={() => handleNavigate(section.route)}
              >
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>{section.icon}</div>
                <h3 style={{ fontWeight: "bold", fontSize: "16px" }}>{section.title}</h3>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
};

export default HRDashboard;
