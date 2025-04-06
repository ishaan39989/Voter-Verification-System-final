import React from 'react';
import './ErrorPage.css';

const ErrorPage = () => {
    return (
        <div className="error-page">
            <h1>Something Went Wrong</h1>
            <p>We encountered an error while processing your request. Please try again later.</p>
            <a href="/">Go back to Home</a>
        </div>
    );
};

export default ErrorPage;