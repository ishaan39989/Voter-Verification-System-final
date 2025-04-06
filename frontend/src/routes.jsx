import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registration from './pages/Registration/Registration';
import CaptureVoterId from './pages/CaptureVoterId/CaptureVoterId';
import CaptureFace from './pages/CaptureFace/CaptureFace';
import DisplayVoterId from './pages/DisplayVoterId/DisplayVoterId';
import Verification from './pages/Verification/Verification';
import ErrorPage from './pages/ErrorPage/ErrorPage';

const AppRoutes = () => {
  return (
    <Router future={{ 
      v7_startTransition: true,
      v7_relativeSplatPath: true 
    }}>
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/capture-voter-id" element={<CaptureVoterId />} />
        <Route path="/capture-face" element={<CaptureFace />} />
        <Route path="/display-voter-id" element={<DisplayVoterId />} />
        <Route path="/verify" element={<Verification />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;