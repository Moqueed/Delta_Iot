import axiosInstance from "."

export const changeStatus = async(email, status) => {
    try{
        const response = await axiosInstance.put(`/api/activeList/change-status/${email}`, {progress_status: status});
        return response.data;
    } catch(error){
        console.error('Error changing status:', error);
        throw error;
    }
};

export const requestReview = async(email, progressStatus, requestBy)=> {
    try{
        const response = await axiosInstance.put(`/api/activeList/request-review/${email}`,{
            progress_status: progressStatus,
            requested_by: requestBy,
        });
        return response.data;
    } catch(error){
        console.error('Error requesting review:', error);
        throw error;
    }
};

export const reviewStatus = async (email, approvalStatus) => {
    try{
        const response = await axiosInstance.put(`/api/activeList/review-status/${email}`, {approval_status: approvalStatus});
        return response.data;
    } catch(error){
        console.error('Error reviewing candidate', error);
        throw error;
    }
};