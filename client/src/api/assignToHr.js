import axiosInstance from ".";


export const assignCandidateToHR = async (formData) => {
  try {
    const response = await axiosInstance.post("/api/assign-to-hr/assign", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // for sending files
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};


