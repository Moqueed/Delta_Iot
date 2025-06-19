import axiosInstance from ".";

// ✅Upload Resume to Candidate, ActiveList, Approval
export const uploadResumeToAll = async (email, file) => {
  try {
    const formData = new FormData();
    formData.append("resume", file);

    const response = await axiosInstance.post(
      `/api/uploads/upload/${email}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Error uploading resume to ActiveList & Approval:", error);
    throw error.response?.data || { message: "Unknown error occurred" };
  }
};

//Upload Resume to AssignedToHR
export const uploadResumeToAssigned = async (email, file) => {
  try {
    const formData = new FormData();
    formData.append("resume", file);

    const response = await axiosInstance.post(
      `/api/uploads/upload-assigned/${email}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Error uploading resume to AssignedToHR:", error);
    throw error.response?.data || { message: "Unknown error occurred" };
  }
};

//Fetch Resume File (Download or Display)
export const fetchResumeFile = async (filename) => {
  try {
    const response = await axiosInstance.get(
      `/api/uploads/upload/${filename}`,
      {
        responseType: "blob", // Important for downloading/displaying files
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Error fetching resume file:", error);
    throw error.response?.data || { message: "File not found" };
  }
};

