const captureImage = (videoRef) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);
    return canvas.toDataURL('image/png');
};

const validateVoterId = (voterId) => {
    const voterIdPattern = /^[A-Z0-9]{10}$/; // Example pattern, adjust as necessary
    return voterIdPattern.test(voterId);
};

const handleApiError = (error) => {
    console.error('API Error:', error);
    return { success: false, message: 'An error occurred while processing your request.' };
};

export { captureImage, validateVoterId, handleApiError };