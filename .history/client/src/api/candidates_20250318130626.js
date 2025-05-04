import axiosInstance from ".";


// ✅ Add a new candidate
export const addCandidate = async (candidateData) => {
  const response = await axiosInstance.post("/add-candidate", candidateData);
  return response.data;
};

// ✅ Get all candidates
export const getCandidates = async () => {
  const response = await axiosInstance.get("/get-candidates");
  return response.data;
};

// ✅ Update a candidate by ID
export const updateCandidate = async (id, candidateData) => {
  const response = await axiosInstance.put(`/update-candidate/${id}`, candidateData);
  return response.data;
};

// ✅ Delete a candidate by ID
export const deleteCandidate = async (id) => {
  const response = await axiosInstance.delete(`/delete-candidate/${id}`);
  return response.data;
};
