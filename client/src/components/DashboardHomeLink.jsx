import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";

const DashboardHomeLink = () => {
  const [dashboardLink, setDashboardLink] = useState("/login"); // default is login

  useEffect(() => {
    const role = localStorage.getItem("role")?.toLowerCase();

    switch (role) {
      case "admin":
        setDashboardLink("/admin-dashboard");
        break;
      case "hr":
        setDashboardLink("/hr-dashboard");
        break;
      default:
        setDashboardLink("/login");
    }
  }, []);

  return (
    <Link to={dashboardLink}>
      <HomeOutlined className="home-icon" style={{ fontSize: "24px" }} />
    </Link>
  );
};

export default DashboardHomeLink;
