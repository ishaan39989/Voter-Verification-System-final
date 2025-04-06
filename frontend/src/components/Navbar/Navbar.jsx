import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Voter ID Registration</Link>
            </div>
            <ul className="navbar-links">
                <li>
                    <Link to="/registration">Registration</Link>
                </li>
                <li>
                    <Link to="/capture-voter-id">Capture Voter ID</Link>
                </li>
                <li>
                    <Link to="/capture-face">Capture Face</Link>
                </li>
                <li>
                    <Link to="/display-voter-id">Display Voter ID</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;