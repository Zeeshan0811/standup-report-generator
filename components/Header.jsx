"use client";
import React from "react";
import Link from "next/link";

const Header = () => {
    return (
        <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
            <div className="container-fluid">
                {/* Brand */}
                <a className="navbar-brand fw-bold fs-4 text-success d-flex align-items-center" href="/">
                    <i className="bi bi-grid-fill me-2 text-success"></i> JB Suite
                </a>

                {/* Toggler for mobile */}
                <button
                    className="navbar-toggler border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Menu Items */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
                        <li className="nav-item mx-1">
                            <Link
                                href="/daily-report"
                                className="nav-link fw-semibold px-3 py-2 rounded text-success hover-bg-light"
                            >
                                <i className="bi bi-journal-text me-1"></i> Daily Report
                            </Link>
                        </li>
                        <li className="nav-item mx-1">
                            <Link
                                href="/standup-report"
                                className="nav-link fw-semibold px-3 py-2 rounded text-success hover-bg-light"
                            >
                                <i className="bi bi-clipboard-check me-1"></i> Stand-Up Report
                            </Link>
                        </li>
                        <li className="nav-item mx-1">
                            <Link
                                href="/markdown-editor"
                                className="nav-link fw-semibold px-3 py-2 rounded text-success hover-bg-light"
                            >
                                <i className="bi bi-markdown me-1"></i> Markdown Editor
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

    );
};

export default Header;
