// src/utils/data.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchCurrentPlaying = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching current playing song:', error);
        return null;
    }
};

export const fetchTopTracks = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/top-tracks`);
        return response.data;
    } catch (error) {
        console.error('Error fetching top tracks:', error);
        return null;
    }
};
