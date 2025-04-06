import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './DisplayVoterId.css';

const DisplayVoterId = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Get voter ID from state or query params
    const voterId = location.state?.voterId || 
                  new URLSearchParams(location.search).get('voterId');
    const isValid = location.state?.isValid || false;

    const handleHome = () => {
        navigate('/');
    };

    return (
        <div className="display-voter-id">
            <h1>Voter ID Confirmation</h1>
            
            {voterId && isValid ? (
                <div className="voter-id-display">
                    <p>Your Voter ID Number:</p>
                    <h2>{voterId}</h2>
                    <div className="success-message">
                        <p>Registration successful! Your voter ID has been verified and your face photo has been stored.</p>
                    </div>
                </div>
            ) : (
                <div className="error-message">
                    <p>Sorry, the Voter ID information is missing or could not be verified.</p>
                </div>
            )}
            
            <div className="button-container">
                <button className="home-button" onClick={handleHome}>
                    {isValid ? "Return to Home" : "Retry"}
                </button>
            </div>
        </div>
    );
};

export default DisplayVoterId;