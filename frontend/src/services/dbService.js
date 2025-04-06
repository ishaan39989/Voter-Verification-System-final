import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const saveUser = async (voterId, facePhoto) => {
    // ...existing code...
};

export const findUserByVoterId = async (voterId) => {
    // ...existing code...
};

export const storeUserData = async (userData) => {
    // ...existing code...
};

// Add default export to fix the import error in Registration.jsx
const dbService = {
    saveUser,
    findUserByVoterId,
    storeUserData
};

export default dbService;