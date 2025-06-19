import React, { useEffect, useState } from "react";
import { Table, Select, DatePicker, Button, Row, Col, message } from "antd";
import moment from "moment";
import { HomeOutlined, LogoutOutlined } from "@ant-design/icons";
import "./HRDataTrackerPage.css";
import { getHRDataEntries } from "../../api/hrDataTracker";
import { Link } from "react-router-dom";

const { Option } = Select;
const { RangePicker } = DatePicker;

const HRDataTrackerPage = () => {
  const [trackerData, setTrackerData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [hrFilter, setHrFilter] = useState(null);
  const [dateRange, setDateRange] = useState([]);

  useEffect(() => {
    fetchTrackerData();
  }, []);

  const fetchTrackerData = async () => {
    try {
      const data = await getHRDataEntries();
      setTrackerData(data);
      setFilteredData(data);
    } catch (error) {
      message.error("Failed to load HR Data Tracker");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout successfully");
    window.location.href = "/login";
  };

  const handleFilter = () => {
    let data = [...trackerData];

    if (statusFilter) {
      data = data.filter((item) => item.status === statusFilter);
    }

    if (hrFilter) {
      data = data.filter((item) => item.HR?.name === hrFilter);
    }

    if (dateRange.length === 2) {
      const [start, end] = dateRange;
      data = data.filter((item) => {
        const statusDate = moment(item.Candidate?.status_date);
        return statusDate.isBetween(start, end, "day", "[]");
      });
    }

    setFilteredData(data);
  };

  const clearFilters = () => {
    setStatusFilter(null);
    setHrFilter(null);
    setDateRange([]);
    setFilteredData(trackerData);
  };

  const columns = [
    { title: "HR Name", dataIndex: ["HR", "name"], key: "hr_name" },
    {
      title: "Candidate Name",
      dataIndex: ["Candidate", "candidate_name"],
      key: "candidate_name",
    },
    {
      title: "Position",
      dataIndex: ["Candidate", "position"],
      key: "position",
    },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Status Date",
      dataIndex: ["Candidate", "status_date"],
      key: "status_date",
    },
    {
      title: "Entry Date",
      dataIndex: ["Candidate", "entry_date"],
      key: "entry_date",
    },
  ];

  const allHRNames = [...new Set(trackerData.map((item) => item.HR?.name))];
  const STATUS_OPTIONS = [
    "Application Received",
    "Phone Screening",
    "L1 Interview",
    "Yet to Share",
    "L2 Interview",
    "Shared with Client",
    "Final Discussion",
    "Offer Released",
    "Joined",
    "Declined Offer",
    "Rejected",
    "Withdrawn",
    "No Show",
    "Buffer",
    "Hold",
  ];

  return (
    <div className="tracker-container">
      <div className="tracker-header">
        <div className="header-left">
          <img src="/logo.png" alt="logo" className="logo" />
          <Link to="/admin-dashboard">
            <HomeOutlined className="home-icon" />
          </Link>
        </div>

        <h2>HR Data Tracker</h2>

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

      <div className="tracker-filters">
        <Row gutter={16} align="middle">
          <Col>
            <Select
              placeholder="Status"
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              style={{ width: 160 }}
              allowClear
            >
              {STATUS_OPTIONS.map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </Col>

          <Col>
            <Select
              placeholder="HR Name"
              value={hrFilter}
              onChange={(val) => setHrFilter(val)}
              style={{ width: 200 }}
            >
              {allHRNames.map((name) => (
                <Option key={name} value={name}>
                  {name}
                </Option>
              ))}
            </Select>
          </Col>

          <Col>
            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates)}
              format="MM/DD/YYYY"
            />
          </Col>

          <Col>
            <Button onClick={clearFilters}>Clear Filter</Button>
          </Col>

          <Col offset={2}>
            <Button type="primary">Export</Button>
          </Col>

          <Col>
            <Button type="primary">Analysis</Button>
          </Col>

          <Col offset={1}>
            <strong>Number of Candidates: {filteredData.length}</strong>
          </Col>
        </Row>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey={(record) =>
          `${record.hr_id}-${record.candidate_id}-${record.status}`
        }
        style={{ marginTop: 20 }}
        bordered
      />
    </div>
  );
};

export default HRDataTrackerPage;
