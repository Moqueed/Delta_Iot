import React, { useEffect, useState } from 'react';
import { Button, Table, message, Modal, Select } from 'antd';
import { changeStatus, requestReview, reviewStatus } from '../../api/activeList';


const { Option } = Select;

const ActiveListPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/candidates');
      const data = await response.json();
      setCandidates(data);
    } catch (error) {
      message.error('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (email) => {
    try {
      await changeStatus(email, status);
      message.success('Status updated successfully');
      fetchCandidates();
    } catch (error) {
      message.error('Failed to update status');
    }
  };

  const handleRequestReview = async (candidate) => {
    try {
      await requestReview(candidate.candidate_email_id, 'Pending Review', 'HR');
      message.success('Review request sent to admin');
      fetchCandidates();
    } catch (error) {
      message.error('Failed to request review');
    }
  };

  const handleReview = async (approvalStatus) => {
    try {
      await reviewStatus(selectedCandidate.candidate_email_id, approvalStatus);
      message.success(`Candidate ${approvalStatus}`);
      setVisible(false);
      fetchCandidates();
    } catch (error) {
      message.error('Failed to submit review');
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'candidate_name', key: 'name' },
    { title: 'Email', dataIndex: 'candidate_email_id', key: 'email' },
    { title: 'Position', dataIndex: 'position', key: 'position' },
    { title: 'Status', dataIndex: 'progress_status', key: 'status' },
    {
      title: 'Actions',
      render: (record) => (
        <>
          <Button onClick={() => handleRequestReview(record)} type="primary">Request Review</Button>
          <Button
            onClick={() => {
              setVisible(true);
              setSelectedCandidate(record);
            }}
            style={{ marginLeft: 10 }}
          >
            Review
          </Button>
          <Select placeholder="Status" onChange={(value) => setStatus(value)} style={{ width: 120, marginLeft: 10 }}>
            <Option value="Shortlisted">Shortlisted</Option>
            <Option value="Interviewed">Interviewed</Option>
            <Option value="Selected">Selected</Option>
          </Select>
          <Button type="default" onClick={() => handleStatusChange(record.candidate_email_id)} style={{ marginLeft: 10 }}>Change Status</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Active List</h2>
      <Table columns={columns} dataSource={candidates} loading={loading} rowKey="candidate_email_id" style={{ marginTop: 20 }} />

      <Modal
  open={visible}
  onCancel={() => setVisible(false)} // Close modal
  title={`Review Candidate: ${selectedCandidate?.candidate_name}`}
  footer={[
    <Button key="reject" onClick={() => handleReview("Rejected")}>
      Reject
    </Button>,
    <Button
      key="approve"
      type="primary"
      onClick={() => handleReview("Approved")}
    >
      Approve
    </Button>,
  ]}
>
  <p>Do you want to approve or reject this candidate?</p>
</Modal>

    </div>
  );
};

export default ActiveListPage;
