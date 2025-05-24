import axiosInstance from ".";

export const updateRejectedCandidate = async (
  id,
  progress_status,
  rejection_reason
) => {
  try {
    const response = await axiosInstance.put(
      `/api/rejected/rejected-data/${id}`,
      {
        progress_status,
        rejection_reason,
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error updating rejected candidate:", error);
    throw error;
  }
};