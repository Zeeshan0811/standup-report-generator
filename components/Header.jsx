"use client";
import React from "react";

const Header = ({ onSelect }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4">
            <div className="container-fluid">
                <a className="navbar-brand fw-bold fs-4" href="#">
                    Daily Reports
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    {/* This ms-auto pushes menu items to the right */}
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <button
                                className="nav-link btn btn-link text-primary fw-semibold"
                                onClick={() => onSelect("daily")}
                            >
                                Today's Task
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className="nav-link btn btn-link text-primary fw-semibold"
                                onClick={() => onSelect("standup")}
                            >
                                Stand-Up Report
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
