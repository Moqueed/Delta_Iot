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
// export const createPosition = async (data) => {
//   try {
//     console.log("📨 Sending data:", data);
//     const response = await axiosInstance.post("/api/positions/add-position", data);
//     return response.data;
//   } catch (error) {
//     console.error("Error creating position:", error);
//     throw error;
//   }
// };

export const createPosition = async (data) => {
  try {
    const payload = {
      job_id: data.job_id || null,
      position: data.position?.trim() || "Unknown Position",
      skills: Array.isArray(data.skills) ? data.skills.map(skill => skill.trim()) : [],
      department: data.department?.trim() || "General",
      vacancy: Number(data.vacancy) || 1,
      location: data.location?.trim() || "Remote",
      description: data.description?.trim() || "No description provided",
    };

    console.log("📨 Sending data:", JSON.stringify(data, null, 2));

    const response = await axiosInstance.post("/api/positions/add-position", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating position:", error.response?.data || error.message);
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
