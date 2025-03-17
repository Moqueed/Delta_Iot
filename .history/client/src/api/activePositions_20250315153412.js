import axiosInstance from ".";


// Fetch all active positions
export const fetchPositions = async () => {
  try {
    const response = await axiosInstance.get("/api/positions/get-position");
    return response.data;
  } catch (error) {
    console.error("Error fetching positions:", error);
    throw error;
  }
};

// Create a new active position
export const createPosition = async (data) => {
  try {
    data = {
      "job_id": "128",
      "position": "React Developer",
      "skills": ["React", "JavaScript", "Node.js"],
      "department": "Engineering",
      "vacancy": 6,
      "manager": "John Doe",
      "minimum_experience": 2,
      "maximum_experience": 5,
      "job_description": "Build scalable web apps",
      "HRs": ["Alice", "Bob"]
    }
    console.log("📨 Sending data:", data);
    const response = await axiosInstance.post("/api/positions/add-position", data);
    return response.data;
  } catch (error) {
    console.error("Error creating position:", error);
    throw error;
  }
};

// Update an existing active position
export const updatePosition = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/api/positions/update/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating position:", error);
    throw error;
  }
};

// Delete an active position
export const deletePosition = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/positions/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting position:", error);
    throw error;
  }
};
