import { API_URL } from '../config/config';
import axiosInstance from '../config/axiosConfig';

export const fetchGroupHistory = async (geohash) => {
    try {
        const response = await axiosInstance.get(`/group-messages/${geohash}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch group history');
    }
};