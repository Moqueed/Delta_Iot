import React, { useEffect, useState } from "react";
import { message, Spin } from "antd";
import axiosInstance from "../../api";
import CandidateForm from "./CandidateForm"; // Import the new component

const ActiveList = () => {
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);

  const fetchCandidates = async () => {
    try {
      const response = await axiosInstance.get("/api/activelist/fetch");
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      message.error("Failed to fetch candidates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "50px auto" }} />;
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Active Candidates List</h2>
      {candidates.map((candidate) => (
        <CandidateForm key={candidate.candidate_id} candidate={candidate} onUpdate={fetchCandidates} />
      ))}
    </div>
  );
};

export default ActiveList;
