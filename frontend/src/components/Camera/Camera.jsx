import React, { useRef, useState, useEffect } from 'react';
import './Camera.css';

const Camera = ({ onCapture }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [permissionError, setPermissionError] = useState(false);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            setIsCameraActive(true);
            setPermissionError(false);
        } catch (error) {
            console.error("Error accessing the camera: ", error);
            setPermissionError(true);
        }
    };

    // Add effect to cleanup camera on unmount
    useEffect(() => {
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    const captureImage = () => {
        if (!videoRef.current || !canvasRef.current) {
            console.error("Video or canvas reference not available");
            return;
        }
        
        const canvas = canvasRef.current;
        const video = videoRef.current;
        
        // Ensure video dimensions are set properly
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        try {
            const imageData = canvas.toDataURL('image/jpeg', 0.9);
            console.log("Image captured successfully", imageData.substring(0, 50) + "...");
            onCapture(imageData);
        } catch (error) {
            console.error("Error capturing image:", error);
        }
    };

    return (
        <div className="camera-container">
            {permissionError && (
                <div className="permission-error">
                    <p>Camera access is required to use this feature.</p>
                    <p>Please allow camera access in your browser settings and try again.</p>
                    <button onClick={startCamera}>Try Again</button>
                </div>
            )}
            <video ref={videoRef} className="camera-video" />
            <canvas ref={canvasRef} className="camera-canvas" width="640" height="480" style={{ display: 'none' }} />
            <div className="camera-controls">
                {!isCameraActive ? (
                    <button onClick={startCamera}>Start Camera</button>
                ) : (
                    <>
                        <button onClick={captureImage}>Capture Image</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Camera;