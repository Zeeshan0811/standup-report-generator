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
                                href="/standup-report-bbs"
                                className="nav-link fw-semibold px-3 py-2 rounded text-success hover-bg-light"
                            >
                                <i className="bi bi-clipboard-check me-1"></i> BBS
                            </Link>
                        </li>
                        <li className="nav-item mx-1">
                            <Link
                                href="/standup-report-bbs-cms"
                                className="nav-link fw-semibold px-3 py-2 rounded text-success hover-bg-light"
                            >
                                <i className="bi bi-clipboard-check me-1"></i> BBS-CMS
                            </Link>
                        </li>
                        <li className="nav-item mx-1">
                            <Link href="/notes"
                                className="nav-link fw-semibold px-3 py-2 rounded text-success hover-bg-light">
                                <i className="bi bi-sticky-fill  me-1"></i> Notes
                            </Link>
                        </li>
                        <li className="nav-item mx-1">
                            <Link
                                href="/markdown-editor"
                                className="nav-link fw-semibold px-3 py-2 rounded text-success hover-bg-light"
                            >
                                <i className="bi bi-markdown me-1"></i> Markdown
                            </Link>
                        </li>
                        <li className="nav-item mx-1">
                            <Link href="/table-to-markdown"
                                className="nav-link fw-semibold px-3 py-2 rounded text-success hover-bg-light">
                                <i className="bi bi-table me-1"></i> Table to Markdown
                            </Link>
                        </li>
                        <li className="nav-item mx-1">
                            <Link href="/json-toolkit"
                                className="nav-link fw-semibold px-3 py-2 rounded text-success hover-bg-light">
                                <i className="bi bi-braces me-1"></i> JSON
                            </Link>
                        </li>
                        {/* <li className="nav-item mx-1">
                            <Link href="/json-to-csv"
                                className="nav-link fw-semibold px-3 py-2 rounded text-success hover-bg-light">
                                <i className="bi bi-filetype-csv me-1"></i> JSON to CSV
                            </Link>
                        </li> */}
                        <li className="nav-item mx-1">
                            <Link href="/qr-code-generator"
                                className="nav-link fw-semibold px-3 py-2 rounded text-success hover-bg-light">
                                <i className="bi bi-qr-code me-1"></i> QR Code
                            </Link>
                        </li>
                        <li className="nav-item mx-1">
                            <Link href="https://tv-hub-zeta.vercel.app/" target="_blank"
                                className="nav-link fw-semibold px-3 py-2 rounded text-success hover-bg-light">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="jsx-5d89f71f57b5a1d"><circle cx="12" cy="12" r="10" class="jsx-5d89f71f57b5a1d"></circle><path d="M12 2 L12 6 M12 18 L12 22 M2 12 L6 12 M18 12 L22 12 M4.93 4.93 L7.76 7.76 M16.24 16.24 L19.07 19.07 M4.93 19.07 L7.76 16.24 M16.24 7.76 L19.07 4.93" class="jsx-5d89f71f57b5a1d"></path></svg>
                                FIFA <span class="badge bg-danger text-light blinking_new">New</span>
                            </Link>
                        </li>

                    </ul>
                </div>
            </div>
        </nav>

    );
};

export default Header;
