import axiosInstance from ".";

// ✅ Add a new candidate
export const addCandidate = async (candidateData) => {
  try {
    const response = await axiosInstance.post("/api/candidates/add-candidate", candidateData);
    return response.data;
  } catch (error) {
    console.error("❌ Error adding candidate:", error);
    throw error.response?.data?.message || "Failed to add candidate";
  }
};

// ✅ search by email
export const searchCandidateByEmail = async (email) => {
  try {
    const response = await axiosInstance.get(`/api/candidates/search/${email}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching candidates:", error);
    throw error.response?.data?.message || "Failed to fetch candidates";
  }
};

// ✅ Update a candidate by ID
export const updateCandidate = async (id, candidateData) => {
  try {
    const response = await axiosInstance.put(`/api/candidates/update-candidate/${id}`, candidateData);
    return response.data;
  } catch (error) {
    console.error("❌ Error updating candidate:", error);
    throw error.response?.data?.message || "Failed to update candidate";
  }
};

// ✅ Delete a candidate by ID
export const deleteCandidate = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/candidates/delete-candidate/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error deleting candidate:", error);
    throw error.response?.data?.message || "Failed to delete candidate";
  }
};
//Get all candidates
export const getCandidates = async () => {
  try {
    const response = await axiosInstance.get("/api/candidates/fetch");
    return response.data;
  } catch (error) {
    console.error("Error fetching candidates:", error);
    throw error.response?.data?.message || "Failed to fetch candidates";
  }
};
