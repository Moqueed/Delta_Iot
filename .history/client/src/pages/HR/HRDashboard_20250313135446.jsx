import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { UserOutlined, FileOutlined, AppstoreAddOutlined, DatabaseOutlined } from "@ant-design/icons";

const { Header, Content, Sider } = Layout;

const HRDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("vacancies");

  const renderContent = () => {
    switch (selectedTab) {
      case "vacancies":
        return <h2>Vacancies Section</h2>;
      case "total-data":
        return <h2>Total Data Section</h2>;
      case "active-list":
        return <h2>Active List Section</h2>;
      case "add-candidate":
        return <h2>Add New Candidate Section</h2>;
      default:
        return <h2>Welcome to the HR Dashboard</h2>;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <div className="logo" style={{ color: "white", textAlign: "center", padding: "16px 0", fontWeight: "bold" }}>
          HR Dashboard
        </div>
        <Menu theme="dark" defaultSelectedKeys={["vacancies"]} mode="inline" onClick={(e) => setSelectedTab(e.key)}>
          <Menu.Item key="vacancies" icon={<FileOutlined />}>Vacancies</Menu.Item>
          <Menu.Item key="total-data" icon={<DatabaseOutlined />}>Total Data</Menu.Item>
          <Menu.Item key="active-list" icon={<UserOutlined />}>Active List</Menu.Item>
          <Menu.Item key="add-candidate" icon={<AppstoreAddOutlined />}>Add New Candidate</Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header style={{ background: "#fff", padding: 0, textAlign: "center", fontSize: "20px" }}>
          HR Management System
        </Header>
        <Content style={{ margin: "16px" }}>
          <div style={{ padding: 24, minHeight: 360, background: "#fff" }}>{renderContent()}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default HRDashboard;
