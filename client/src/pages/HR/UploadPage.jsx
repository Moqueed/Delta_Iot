import React, { useEffect, useState } from "react";
import { Layout, List, Typography, message, Spin, Button } from "antd";
import { fetchResumeFile } from "../../api/upload";
import axiosInstance from "../../api";
import DashboardHomeLink from "../../components/DashboardHomeLink";
import { LogoutOutlined } from "@ant-design/icons";

const { Sider, Content } = Layout;

const UploadPage = () => {
  const [fileList, setFileList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch uploaded files using axiosInstance
  const fetchUploadedFiles = async () => {
    try {
      const res = await axiosInstance.get("/api/uploads/list");
      setFileList(res.data.files);
    } catch (err) {
      console.error("❌ Error fetching file list", err);
      message.error("Failed to load uploaded files");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout successfully");
    window.location.href = "/login";
  };

  const handleFileClick = async (filename) => {
  try {
    setLoading(true);
    const blob = await fetchResumeFile(filename);
    const url = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
    setPreviewUrl(url);
  } catch (err) {
    console.error("❌ Error previewing file", err);
    message.error("Could not preview file");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  return (
    <div className="total-master-data-container">
      <div className="candidate-header">
        <div className="header-left">
          <img src="/images/hrms-logo.jpg" alt="logo" className="logo" />
          <DashboardHomeLink />
        </div>

        <h2>uploads</h2>

        <div className="header-right">
          <span className="welcome-text">Welcome: Moqueed Ahmed</span>
          <Button
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            type="primary"
            danger
            size="small"
            style={{ marginLeft: "15px" }}
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="upload-body">
        <Layout style={{ minHeight: "100vh" }}>
          <Sider width={300} style={{ background: "#f0f2f5", padding: "20px" }}>
            <Typography.Title level={4}>Uploaded Files</Typography.Title>
            <List
              bordered
              dataSource={fileList}
              renderItem={(item) => (
                <List.Item
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      item === selectedFile ? "#e6f7ff" : undefined,
                  }}
                  onClick={() => handleFileClick(item)}
                >
                  {item}
                </List.Item>
              )}
            />
          </Sider>

          <Content style={{ padding: 24 }}>
            <Typography.Title level={4}>Resume Preview</Typography.Title>
            {loading ? (
              <Spin size="large" />
            ) : previewUrl ? (
              <iframe
                src={previewUrl}
                title="Resume Preview"
                width="100%"
                height="800px"
                style={{ border: "1px solid #ddd", borderRadius: "8px" }}
              />
            ) : (
              <p>Select a file to preview</p>
            )}
          </Content>
        </Layout>
      </div>
    </div>
  );
};

export default UploadPage;
