import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [voterId, setVoterId] = useState(null);
    const [facePhoto, setFacePhoto] = useState(null);
    const [error, setError] = useState(null);

    const updateVoterId = (id) => {
        setVoterId(id);
    };

    const updateFacePhoto = (photo) => {
        setFacePhoto(photo);
    };

    const clearAuthData = () => {
        setVoterId(null);
        setFacePhoto(null);
        setError(null);
    };

    return (
        <AuthContext.Provider value={{ voterId, facePhoto, error, updateVoterId, updateFacePhoto, clearAuthData, setError }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};