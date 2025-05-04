import { message, Select } from "antd";
import React, { useEffect, useState } from "react";
import { changeStatus, requestReview, reviewStatus } from "../../api/activeList";


const{Option} = Select;


const ActiveListPage = () => {
    const[candidates, setCandidates] = useState([]);
    const[loading, setLoading] = useState(false);
    const[visible, setVisible] = useState(false);
    const[selectedCandidate, setSelectedCandidate] = useState(null);
    const[status, setStatus] = useState('');

    useEffect(() => {
        fetchCandidates();
    },[]);

    const fetchCandidates = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/candidates');
            const data = await response.json();
            setCandidates(data);
        } catch(error) {
            message.error('Failed to load candidates');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (email){
        try{
            await changeStatus(email, status);
            message.success('Status updated successfully');
            fetchCandidates();
        } catch(error){
            message.error('Failed to update status');
        }
    };

    const handleRequestReview = async (candidate) => {
        try{
            await requestReview(candidate.candidate_email_id, approvalStatus);
            message.success(`candidate ${approvalStatus}`);
            setVisible(false);
            fetchCandidates();
        } catch(error){
            message.error('Failed to submit review');
        }
    };

    const handleReview = async (approvalStatus) => {
        try{
            await reviewStatus(selectedCandidate.candidate_email_id, approvalStatus);
            message.success(`Candidate ${approvalStatus}`);
            setVisible(false);
            fetchCandidates();
        } catch(error){
            message.error('Failed to submit review');
        }
    };

    const columns = [
        {Title: 'Name', dataIndex: 'candidate_name', key: 'name'},
        {Title: 'Email', dataIndex: 'candidate_email_id', key: 'email'},
        {Title: 'Position', dataIndex: 'position', key: 'position'},
        {Title: 'Status', dataIndex: 'progress_status', key: 'status'},
        {
            title: 'Actions',
            render: (record)
        }
    ]
}