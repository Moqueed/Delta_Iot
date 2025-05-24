import axiosInstance from ".";

//fetch total master data
export const fetchTotalMasterData = async () => {
  try {
    const response = await axiosInstance.get(
      "/api/totaldata/total-master-data/fetch"
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching Total Master Data:", error);
  }
};
