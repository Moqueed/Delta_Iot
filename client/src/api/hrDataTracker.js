import axiosInstance from ".";

// ✅ Add a new HR Data Tracker Entry
export const addHRDataEntry = async (data) => {
  try {
    const response = await axiosInstance.post("/api/hr-data-tracker/add", data);
    return response.data;
  } catch (error) {
    console.error("Error adding HR data entry:", error);
    throw new Error(
      error.response?.data?.message || "Failed to add HR data entry"
    );
  }
};

// ✅ Get all HR Data Tracker Entries
export const getHRDataEntries = async () => {
  try {
    const response = await axiosInstance.get("/api/hr-data-tracker/fetch");
    return response.data;
  } catch (error) {
    console.error("Error fetching HR data entries:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch HR data entries"
    );
  }
};
