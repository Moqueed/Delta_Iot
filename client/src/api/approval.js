import axiosInstance from ".";

export const createNewApproval = async (approvalData) => {
  try {
    const response = await axiosInstance.post(
      "/api/approvals/newApproval",
      approvalData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating new approval:", error);
    throw error;
  }
};

export const savedApprovalDraft = async (approvalData) => {
  try {
    const response = await axiosInstance.post(
      "/api/approvals/approval/save",
      approvalData
    );
    return response.data;
  } catch (error) {
    console.error("Error saving draft:", error);
    throw error;
  }
};
