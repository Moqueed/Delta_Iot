import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";

const DashboardHomeLink = () => {
  const [dashboardLink, setDashboardLink] = useState("/");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "Admin") {
      setDashboardLink("/admin-dashboard");
    } else if (role === "HR") {
      setDashboardLink("/hr-dashboard");
    } else {
      setDashboardLink("/login");
    }
  }, []);

  return (
    <Link to={dashboardLink}>
      <HomeOutlined className="home-icon" />
    </Link>
  );
};

export default DashboardHomeLink;
