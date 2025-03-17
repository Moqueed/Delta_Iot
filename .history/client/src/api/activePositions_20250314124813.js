import axiosInstance from ".";


// Fetch all active positions
export const fetchPositions = async () => {
  try {
    const response = await axiosInstance.get("/api/positions");
    return response.data;
  } catch (error) {
    console.error("Error fetching positions:", error);
    throw error;
  }
};

// Create a new active position
export const createPosition = async (data) => {
  try {
    const response = await axiosInstance.post("/api/positions", data);
    return response.data;
  } catch (error) {
    console.error("Error creating position:", error);
    throw error;
  }
};

// Update an existing active position
export const updatePosition = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/api/positions/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating position:", error);
    throw error;
  }
};

// Delete an active position
export const deletePosition = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/positions/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting position:", error);
    throw error;
  }
};
