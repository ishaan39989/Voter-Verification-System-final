import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const registerUser = async (voterId, facePhoto) => {
    try {
        const response = await axios.post(`${API_URL}/register`, {
            voterId,
            facePhoto
        });
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw new Error('Error registering user: ' + error.message);
    }
};

export const captureFacePhoto = async (photo) => {
    try {
        // For development purposes, we'll just return the photo without API call
        console.log('Face photo captured locally:', photo.substring(0, 50) + '...');
        
        return {
            success: true,
            data: photo,
            message: 'Face photo captured successfully'
        };
    } catch (error) {
        console.error('Error capturing face photo:', error);
        return {
            success: false,
            message: 'Error capturing face photo: ' + error.message
        };
    }
};

export const storeUserData = async (voterIdNumber, facePhoto) => {
    try {
        const response = await axios.post(`${API_URL}/register`, {
            voterId: voterIdNumber,
            facePhoto
        });
        return response.data;
    } catch (error) {
        console.error('Error storing user data:', error);
        throw new Error('Error storing user data: ' + error.message);
    }
};
