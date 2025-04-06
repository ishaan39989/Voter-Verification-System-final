import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Camera from '../../components/Camera/Camera';
import { captureVoterIdPhoto } from '../../services/geminiService';
import dbService from '../../services/dbService';
import './Registration.css';

const Registration = () => {
    const [voterIdPhoto, setVoterIdPhoto] = useState(null);
    const [voterIdNumber, setVoterIdNumber] = useState('');
    const [facePhoto, setFacePhoto] = useState(null);
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showVoterId, setShowVoterId] = useState(false);
    const navigate = useNavigate();

    const handleVoterIdCapture = async (photo) => {
        setVoterIdPhoto(photo);
        setIsProcessing(true);
        try {
            // Attempt to extract voter ID
            const idNumber = await captureVoterIdPhoto(photo);
            if (idNumber) {
                setVoterIdNumber(idNumber);
                setShowVoterId(true);
            } else {
                setError('Failed to extract voter ID. Please try again.');
            }
        } catch (err) {
            setError('Failed to capture voter ID: ' + err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRetry = () => {
        setVoterIdPhoto(null);
        setVoterIdNumber('');
        setShowVoterId(false);
    };

    const handleContinue = () => {
        // Pass the voter ID explicitly in the state
        navigate('/capture-face', { 
            state: { 
                voterIdNumber: voterIdNumber 
            }
        });
    };

    const handleFaceCapture = async (photo) => {
        setFacePhoto(photo);
        try {
            await dbService.storeUserData({ voterIdNumber, facePhoto: photo });
            navigate('/display-voter-id');
        } catch (err) {
            setError('Failed to store user data. Please try again.');
        }
    };

    return (
        <div className="registration-container">
            <h1>Voter ID Registration</h1>
            
            <div className="feature-links">
                <Link to="/verify" className="verification-link">Already registered? Verify your identity</Link>
            </div>
            
            {error && <p className="error-message">{error}</p>}
            
            {!voterIdPhoto && !showVoterId && (
                <Camera onCapture={handleVoterIdCapture} />
            )}
            
            {isProcessing && (
                <div className="processing-message">
                    <p>Processing your voter ID...</p>
                    <div className="loader"></div>
                </div>
            )}
            
            {showVoterId && (
                <div className="voter-id-result">
                    <h2>Extracted Voter ID:</h2>
                    <div className="voter-id-display">{voterIdNumber}</div>
                    <p>Is this your correct Voter ID number?</p>
                    <div className="action-buttons">
                        <button className="retry-button" onClick={handleRetry}>No, Try Again</button>
                        <button className="continue-button" onClick={handleContinue}>Yes, Continue</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Registration;