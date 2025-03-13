import axiosInstance from ".";

export const RegisterUser = async (values) => {
  try {
    console.log("🔍 Registering user:", values); // Debug log
    const response = await axiosInstance.post("/api/users/register", values);
    console.log("✅ User Registered:", response.data);
    return response.data;
  } catch (err) {
    console.error("❌ Error registering user:", err.response?.data || err.message);
  }
};


export const LoginUser = async (values) => {
  try {
    const response = await axiosInstance.post("/api/users/login", values);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};
