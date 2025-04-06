import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Camera from '../../components/Camera/Camera';
import { sendToGemini } from '../../services/geminiService';
import './CaptureVoterId.css';

const CaptureVoterId = () => {
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleCapture = async (capturedPhoto) => {
        setPhoto(capturedPhoto);
        setLoading(true);
        try {
            const result = await sendToGemini(capturedPhoto);
            setLoading(false);
            
            if (result.success) {
                // Extract voter ID from the detected text
                const detectedText = result.detectedText || '';
                
                // Extract a voter ID-like pattern from the text (assumes format like "ABC123456789")
                const match = detectedText.match(/[A-Z0-9]{6,}/);
                const voterIdNumber = match ? match[0] : '';
                
                console.log("Extracted voter ID:", voterIdNumber);
                
                if (voterIdNumber) {
                    // Make sure to use the right property name in state
                    navigate('/capture-face', { 
                        state: { 
                            voterIdNumber: voterIdNumber 
                        }
                    });
                } else {
                    setError('Could not identify a valid voter ID number in the image. Please try again.');
                }
            } else {
                setError('Failed to process the image. Please try again.');
            }
        } catch (err) {
            setLoading(false);
            setError('An error occurred while processing the image. Please try again.');
            console.error('Error processing image:', err);
        }
    };

    return (
        <div className="capture-voter-id-container">
            <h1>Capture Your Voter ID</h1>
            <p className="instruction">Please position your voter ID card clearly in the frame and take a photo.</p>
            
            {error && <p className="error-message">{error}</p>}
            
            {loading ? (
                <div className="loading-container">
                    <p>Processing image...</p>
                    <div className="loader"></div>
                </div>
            ) : (
                <Camera onCapture={handleCapture} />
            )}
            
            {photo && !loading && (
                <div className="preview-container">
                    <img src={photo} alt="Captured ID" className="id-preview" />
                </div>
            )}
        </div>
    );
};

export default CaptureVoterId;