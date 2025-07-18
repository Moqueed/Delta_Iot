import React, { useEffect, useState } from "react";
import {
  Table,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  message,
} from "antd";
import moment from "moment";
import { HomeOutlined, LogoutOutlined } from "@ant-design/icons";
import "./HRDataTrackerPage.css";
import {
  fetchFilteredTrackerFromActiveList,
  getHRDataEntries,
  updateCandidateAndTracker,
} from "../../api/hrDataTracker";
import { Link } from "react-router-dom";
import { useAdmin } from "../../components/AdminContext";

const { Option } = Select;
const { RangePicker } = DatePicker;

const HRDataTrackerPage = () => {
  const [trackerData, setTrackerData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [hrFilter, setHrFilter] = useState(null);
  const [dateRange, setDateRange] = useState([]);
  const { adminName } = useAdmin();

  useEffect(() => {
    fetchTrackerData();
  }, []);

  const fetchTrackerData = async () => {
    try {
      const data = await getHRDataEntries();
      const result = await fetchFilteredTrackerFromActiveList({});
      setFilteredData(result);
      setTrackerData(data);
    } catch (error) {
      message.error("Failed to load HR Data Tracker");
    }
  };

  const handleFilter = async () => {
    try {
      const filters = {
        status: statusFilter,
        hr_name: hrFilter,
        startDate: dateRange?.[0]?.format("YYYY-MM-DD"),
        endDate: dateRange?.[1]?.format("YYYY-MM-DD"),
      };

      const result = await fetchFilteredTrackerFromActiveList(filters);
      setFilteredData(result);
    } catch (error) {
      message.error("Failed to apply filters");
    }
  };

  const clearFilters = () => {
    setStatusFilter(null);
    setHrFilter(null);
    setDateRange([]);
    setFilteredData(trackerData);
  };

  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout successfully");
    window.location.href = "/login";
  };

  const columns = [
    { title: "HR Name", dataIndex: "HR_name", key: "HR_name" },
    { title: "Candidate Name", dataIndex: "candidate_name", key: "candidate_name" },
    { title: "Position", dataIndex: "position", key: "position" },
    { title: "Status", dataIndex: "progress_status", key: "progress_status" },
    {
      title: "Status Date",
      dataIndex: "status_date",
      key: "status_date",
      render: (date) => (date ? moment(date).format("DD/MM/YYYY") : ""),
    },
    {
      title: "Entry Date",
      dataIndex: "entry_date",
      key: "entry_date",
      render: (date) => (date ? moment(date).format("DD/MM/YYYY") : ""),
    },
  ];

  const allHRNames = [...new Set(trackerData.map((item) => item?.name))];

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
          <img src="/images/hrms-logo.jpg" alt="logo" className="logo" />
          <Link to="/admin-dashboard">
            <HomeOutlined className="home-icon" />
          </Link>
        </div>

        <h2>HR Data Tracker</h2>

        <div className="header-right">
          <span className="welcome-text">Welcome: {adminName}</span>
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
              allowClear
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
            <Button type="primary" onClick={handleFilter}>
              Apply Filter
            </Button>
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
        rowKey={(record) => record.id}
        style={{ marginTop: 20 }}
        bordered
      />
    </div>
  );
};

export default HRDataTrackerPage;
