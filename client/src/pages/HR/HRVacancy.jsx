import { useEffect, useState } from "react";
import { deleteVacancy, getAllVacancies } from "../../api/hrVacancy";
import { Button, message, Popconfirm, Spin, Table } from "antd";

const HRVacancy = () => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);

  //Fetch all vacancies on Load
  const fetchVacancies = async () => {
    try {
      setLoading(true);
      const data = await getAllVacancies();
      setVacancies(data);
    } catch (error) {
      message.error("Failed to load vacancies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVacancies();
  }, []);

  const handleDelete = async (job_id) => {
    try {
      await deleteVacancy(job_id);
      message.success("Vacancy deleted successfully!");
      fetchVacancies();
    } catch (error) {
      message.error("Failed to delete vacancy");
    }
  };

  const columns = [
    { title: "Job_id", dataIndex: "job_id", key: "job_id"},
    { title: "Position", dataIndex: "position", key: "position" },
    { title: "Department", dataIndex: "department", key: "department" },
    { title: "Vacancy", dataIndex: "vacancy", key: "vacancy" },
    { title: "Manager", dataIndex: "manager", key: "manager" },
    {
      title: "Experience",
      key: "experience",
      render: (_, record) =>
        `${record.minimum_experience} - ${record.maximum_experience} years`,
    },
    { title: "Job Description", dataIndex: "job_description", key: "job_description" },
    { title: "HRs", dataIndex: "HRs", key: "HRs"},
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={() => console.log("View Details:", record.job_id)}
          >
            View
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this vacancy?"
            onConfirm={() => handleDelete(record.job_id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2> Vacancies </h2>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          dataSource={vacancies}
          columns={columns}
          rowKey="job_id"
          pagination={{ pageSize: 5 }}
        />
      )}
    </div>
  );
};

export default HRVacancy;
