import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Camera from '../../components/Camera/Camera';
import axios from 'axios';
import './CaptureFace.css';

const CaptureFace = () => {
    const [facePhoto, setFacePhoto] = useState(null);
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get the voter ID from state or query params
    const voterIdNumber = location.state?.voterIdNumber || 
                     new URLSearchParams(location.search).get('voterId');
    
    // Debug logging to see what's happening
    useEffect(() => {
        console.log("Location state:", location.state);
        console.log("Voter ID from location:", voterIdNumber);
    }, [location, voterIdNumber]);

    const handleCapture = async (photo) => {
        if (!voterIdNumber) {
            setError('Voter ID information is missing. Please go back and try again.');
            return;
        }

        setFacePhoto(photo);
        setIsProcessing(true);
        
        try {
            // Make a direct API call to the server without any middleware
            const apiUrl = 'http://localhost:5000/api';
            console.log("Sending data to:", `${apiUrl}/register`);
            console.log("Voter ID:", voterIdNumber);
            
            // Ensure the data format is correct - voterId must be a proper string
            // and facePhoto must be a valid base64 string
            const response = await axios.post(`${apiUrl}/register`, {
                voterId: voterIdNumber.trim(), // Trim any whitespace
                facePhoto: photo  // Ensure this is a proper base64 string
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            setIsProcessing(false);
            console.log("Server response:", response.data);
            
            navigate('/display-voter-id', { 
                state: { 
                    voterId: voterIdNumber,
                    isValid: true 
                }
            });
        } catch (err) {
            setIsProcessing(false);
            console.error('Error storing user data:', err);
            
            // More detailed error logging
            if (err.response) {
                console.error('Response data:', err.response.data);
                console.error('Response status:', err.response.status);
                console.error('Response headers:', err.response.headers);
            }
            
            // Show a more detailed error message
            let errorMessage = 'Failed to connect to the server. ';
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                errorMessage += `Server error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`;
            } else if (err.request) {
                // The request was made but no response was received
                errorMessage += 'No response from server. Please check if the backend is running.';
            } else {
                // Something happened in setting up the request
                errorMessage += err.message;
            }
            
            setError(errorMessage);
            
            // For testing purposes, still allow navigation
            if (window.confirm('Backend connection failed. Continue anyway for testing?')) {
                navigate('/display-voter-id', { 
                    state: { 
                        voterId: voterIdNumber,
                        isValid: true 
                    }
                });
            }
        }
    };

    if (!voterIdNumber) {
        return (
            <div className="capture-face-container error-container">
                <h1>Error</h1>
                <p className="error-message">Voter ID information is missing. Please go back and try again.</p>
                <button onClick={() => navigate('/')} className="back-button">
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="capture-face-container">
            <h1>Capture Your Face Photo</h1>
            <p className="instruction">Please look straight at the camera and take a clear photo of your face.</p>
            
            {error && <p className="error-message">{error}</p>}
            
            {!facePhoto && !isProcessing && (
                <Camera onCapture={handleCapture} />
            )}
            
            {isProcessing && (
                <div className="processing-message">
                    <p>Processing your information...</p>
                    <div className="loader"></div>
                </div>
            )}
            
            {facePhoto && !isProcessing && (
                <div className="preview-container">
                    <h2>Preview</h2>
                    <img src={facePhoto} alt="Captured Face" className="face-preview" />
                </div>
            )}
        </div>
    );
};

export default CaptureFace;