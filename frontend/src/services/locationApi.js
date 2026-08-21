import { API_URL } from '../config/config';
import axiosInstance from "../config/axiosConfig";

export const updateLocation = async (userId, latitude, longitude) => {
    const response = await axiosInstance.put(
        `/auth/location?userId=${userId}`,
        {
            latitude,
            longitude
        }
    );

    return response.data;
};

export const getZoneUsers = async (geohash, userId) => {
    const response = await axiosInstance.get(
        `/auth/zone-users?geohash=${geohash}&userId=${userId}`
    );

    return response.data;
};