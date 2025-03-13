import React from "react";
import { Card, Typography } from "antd";

const { Title } = Typography;

const TotalDataPage = () => {
  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>Total Data Overview</Title>

      <Card title="Total Master Data" style={{ marginBottom: 10 }}>
        {/* Data table or content */}
      </Card>

      <Card title="Newly Joined Employees" style={{ marginBottom: 10 }}>
        {/* Data table or content */}
      </Card>

      <Card title="About to Join" style={{ marginBottom: 10 }}>
        {/* Data table or content */}
      </Card>

      <Card title="Buffer Data" style={{ marginBottom: 10 }}>
        {/* Data table or content */}
      </Card>

      <Card title="Rejected Candidates" style={{ marginBottom: 10 }}>
        {/* Data table or content */}
      </Card>
    </div>
  );
};

export default TotalDataPage;
