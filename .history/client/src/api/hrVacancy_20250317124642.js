import axiosInstance from ".";


export const getAllVacancies = async () => {
  try {
    const response = await axiosInstance.get("/api/hrvacancies/get-vacancies");
    return response.data;
  } catch (error) {
    console.error("Error fetching vacancies:", error);
    throw error;
  }
};

export const getVacancyById = async (job_id) => {
  try {
    const response = await axiosInstance.get(`/api/hrvacancies/get-vacancy/${job_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching vacancy:", error);
    throw error;
  }
};

export const deleteVacancy = async (job_id) => {
  try {
    const response = await axiosInstance.delete(`/api/hrvacancies/delete-vacancy/${job_id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting vacancy:", error);
    throw error;
  }
};
