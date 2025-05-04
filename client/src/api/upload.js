import axios from "axios";

// ✅ Upload file to the backend
export const uploadFile = async (email, file) => {
  const formData = new FormData();
  formData.append("resume", file);

  try {
    const response = await axios.post(`/api/uploads/upload/${email}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
