import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col } from "antd";
import { FileOutlined, DatabaseOutlined, UserOutlined, AppstoreAddOutlined } from "@ant-design/icons";

const HRDashboard = () => {
  const navigate = useNavigate();

  const sections = [
    { key: "vacancies", icon: <FileOutlined />, title: "Vacancies", borderColor: "border-yellow-500" },
    { key: "total-data", icon: <DatabaseOutlined />, title: "Total Data", borderColor: "border-green-500" },
    { key: "active-list", icon: <UserOutlined />, title: "Active List", borderColor: "border-blue-500" },
    { key: "add-candidate", icon: <AppstoreAddOutlined />, title: "Add New Candidate", borderColor: "border-red-500" },
  ];

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <Row gutter={[24, 24]} className="w-full h-full p-10" justify="center" align="middle">
        {sections.map((section) => (
          <Col key={section.key} xs={24} sm={12} md={6} lg={6} xl={6} className="flex justify-center">
            <Card
              hoverable
              className={`w-96 h-96 flex flex-col items-center justify-center shadow-lg rounded-xl p-6 border-4 ${section.borderColor}`}
              onClick={() => navigate(`/${section.key}`)}
            >
              <div className="text-8xl mb-6 text-blue-500">{section.icon}</div>
              <h3 className="text-4xl font-bold">{section.title}</h3>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HRDashboard;
