import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col } from "antd";
import { FileOutlined, DatabaseOutlined, UserOutlined, AppstoreAddOutlined } from "@ant-design/icons";

const HRDashboard = () => {
  const navigate = useNavigate();

  const sections = [
    { key: "vacancies", icon: <FileOutlined />, title: "Vacancies" },
    { key: "total-data", icon: <DatabaseOutlined />, title: "Total Data" },
    { key: "active-list", icon: <UserOutlined />, title: "Active List" },
    { key: "add-candidate", icon: <AppstoreAddOutlined />, title: "Add New Candidate" },
  ];

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <Row gutter={[24, 24]} className="w-full h-full p-10" justify="center" align="middle">
        {sections.map((section) => (
          <Col key={section.key} xs={24} sm={12} md={6} lg={6} xl={6}>
            <Card
              hoverable
              className="h-full flex flex-col items-center justify-center shadow-lg rounded-xl p-4"
              onClick={() => navigate(`/${section.key}`)}
            >
              <div className="text-4xl mb-4 text-blue-500">{section.icon}</div>
              <h3 className="text-lg font-semibold">{section.title}</h3>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HRDashboard;
