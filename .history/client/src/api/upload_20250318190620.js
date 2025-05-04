import axiosInstance from ".";

export const uploadFile = async(email, file) => {
    const formData = new FormData();
    formData.append("resume", file);

    try{
        const response = await axiosInstance.post()
    }
}