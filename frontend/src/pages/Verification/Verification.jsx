import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Camera from '../../components/Camera/Camera';
import axios from 'axios';
import './Verification.css';

const Verification = () => {
    const [voterId, setVoterId] = useState('');
    const [step, setStep] = useState('enter-id'); // 'enter-id', 'capture-face', 'result'
    const [facePhoto, setFacePhoto] = useState(null);
    const [isVerified, setIsVerified] = useState(false);
    const [confidence, setConfidence] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleVoterIdSubmit = (e) => {
        e.preventDefault();
        if (!voterId || voterId.trim() === '') {
            setError('Please enter a valid Voter ID');
            return;
        }
        
        setStep('capture-face');
        setError('');
    };

    const handleCapture = async (photo) => {
        setFacePhoto(photo);
        setIsProcessing(true);
        setError('');
        
        try {
            const apiUrl = 'http://localhost:5000/api';
            
            console.log('Sending verification request:');
            console.log('Voter ID:', voterId);
            console.log('Photo data length:', photo.length);
            
            // Make the verification request
            const response = await axios.post(`${apiUrl}/verify`, {
                voterId,
                facePhoto: photo
            });
            
            console.log('Verification API response:', response.data);
            
            // Set values based on response
            setIsVerified(response.data.isVerified);
            setConfidence(response.data.confidence || 0);
            
            // Store additional response data
            const apiDetails = {
                rawConfidence: response.data.rawConfidence,
                thresholds: response.data.thresholds
            };
            console.log('Face comparison details:', apiDetails);
            
            setStep('result');
        } catch (err) {
            console.error('Verification error:', err);
            
            // Updated error handling
            let errorMessage = 'Failed to verify face.';
            
            if (err.response) {
                console.error('Error response:', err.response.data);
                errorMessage = err.response.data.message || errorMessage;
            } else if (err.request) {
                errorMessage = 'No response from server. Please check if the server is running.';
            } else {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRetry = () => {
        setStep('enter-id');
        setFacePhoto(null);
        setVoterId('');
        setError('');
    };

    const handleHome = () => {
        navigate('/');
    };

    return (
        <div className="verification-container">
            <h1>Voter Verification</h1>
            
            {error && <p className="error-message">{error}</p>}
            
            {step === 'enter-id' && (
                <div className="voter-id-form">
                    <p>Please enter your Voter ID number</p>
                    <form onSubmit={handleVoterIdSubmit}>
                        <input 
                            type="text" 
                            value={voterId}
                            onChange={(e) => setVoterId(e.target.value)}
                            placeholder="Enter Voter ID"
                            className="voter-id-input"
                        />
                        <button type="submit" className="submit-button">Continue</button>
                    </form>
                </div>
            )}
            
            {step === 'capture-face' && (
                <div className="face-capture">
                    <p>Please look at the camera and capture your face</p>
                    {isProcessing ? (
                        <div className="processing">
                            <p>Processing...</p>
                            <div className="loader"></div>
                        </div>
                    ) : (
                        <Camera onCapture={handleCapture} />
                    )}
                </div>
            )}
            
            {step === 'result' && (
                <div className="verification-result">
                    <h2>{isVerified ? 'Verification Successful!' : 'Verification Failed'}</h2>
                    
                    {isVerified ? (
                        <div className="success-message">
                            <p>Your identity has been verified with {(confidence * 100).toFixed(2)}% confidence.</p>
                            <p>Thank you for using our verification system.</p>
                        </div>
                    ) : (
                        <div className="failure-message">
                            <p>We could not verify your identity.</p>
                            <p>Confidence level: {(confidence * 100).toFixed(2)}%</p>
                            <p>Please try again or contact support.</p>
                        </div>
                    )}
                    
                    <div className="development-note">
                        <p><small>Note: Currently running in simulation mode</small></p>
                    </div>
                    
                    <div className="button-container">
                        <button onClick={handleRetry} className="retry-button">Try Again</button>
                        <button onClick={handleHome} className="home-button">Return Home</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Verification;
