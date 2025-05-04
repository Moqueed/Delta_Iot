import axiosInstance from ".";


// ✅ Add a new candidate
export const addCandidate = async (candidateData) => {
  const response = await axiosInstance.post("/api/candidates/add-candidate", candidateData);
  return response.data;
};

// ✅ Get all candidates
export const getCandidates = async () => {
  const response = await axiosInstance.get("/api/candidates/get-candidates");
  return response.data;
};

// ✅ Update a candidate by ID
export const updateCandidate = async (id, candidateData) => {
  const response = await axiosInstance.put(`/api/candidates/update-candidate/${id}`, candidateData);
  return response.data;
};

// ✅ Delete a candidate by ID
export const deleteCandidate = async (id) => {
  const response = await axiosInstance.delete(`/api/candidates/delete-candidate/${id}`);
  return response.data;
};
