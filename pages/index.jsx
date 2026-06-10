"use client";
import React from "react";

const Home = () => {

  return (
    <>
      {/* <!-- Hero Section --> */}
      <section className="hero">
        <div className="container">
          <h1 className="text-success">Welcome to JB Suite</h1>
          <p>Your daily productivity tools — simple, fast, and efficient.</p>
        </div>
      </section>

      {/* <!-- Tools Section --> */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center g-4">

            {/* <!-- Daily Report Generator --> */}
            <div className="col-md-4">
              <div className="card tool-card h-100">
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-journal-text display-5 text-primary"></i>
                  </div>
                  <h5 className="card-title fw-bold">Daily Report Generator</h5>
                  <p className="card-text text-muted">
                    Generate your daily work reports effortlessly.
                  </p>
                  <a href="/daily-report" className="btn btn-primary">Open Tool</a>
                </div>
              </div>
            </div>

            {/* <!-- Stand Up Report Generator - BBS --> */}
            <div className="col-md-4">
              <div className="card tool-card h-100">
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-clipboard-check display-5 text-danger"></i>
                  </div>
                  <h5 className="card-title fw-bold">Stand Up Report (BBS)</h5>
                  <p className="card-text text-muted">
                    Quickly create structured team stand-up reports.
                  </p>
                  <a href="/standup-report-bbs" className="btn btn-danger">Open Tool</a>
                </div>
              </div>
            </div>

            {/* <!-- Stand Up Report Generator - BBS-CMS --> */}
            <div className="col-md-4">
              <div className="card tool-card h-100">
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-clipboard-check display-5 text-success"></i>
                  </div>
                  <h5 className="card-title fw-bold">Stand Up Report (BBS-CMS)</h5>
                  <p className="card-text text-muted">
                    Quickly create structured team stand-up reports.
                  </p>
                  <a href="/standup-report-bbs-cms" className="btn btn-success text-white">Open Tool</a>
                </div>
              </div>
            </div>

            {/* <!-- Notes App --> */}
            <div className="col-md-4">
              <div className="card tool-card h-100">
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-sticky-fill display-5 text-success"></i>
                  </div>
                  <h5 className="card-title fw-bold">Quick Notes</h5>
                  <p className="card-text text-muted">
                    Note  down ideas, create checklists, and keep your thoughts organized in one place.
                  </p>
                  <a href="/notes" className="btn btn-success px-4">
                    Open Tool
                  </a>
                </div>
              </div>
            </div>

            {/* <!-- Markdown Editor --> */}
            <div className="col-md-4">
              <div className="card tool-card h-100">
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-markdown display-5 text-warning"></i>
                  </div>
                  <h5 className="card-title fw-bold">Markdown Editor</h5>
                  <p className="card-text text-muted">
                    Write, preview, and export Markdown documents with live rendering.
                  </p>
                  <a href="/markdown-editor" className="btn btn-warning text-dark px-4">
                    Open Tool
                  </a>
                </div>
              </div>
            </div>

            {/* <!-- Table to Markdown --> */}
            <div className="col-md-4">
              <div className="card tool-card h-100">
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-table display-5 text-success"></i>
                  </div>
                  <h5 className="card-title fw-bold">Table to Markdown</h5>
                  <p className="card-text text-muted">
                    Convert tables to Markdown format instantly .
                  </p>
                  <a href="/table-to-markdown" className="btn btn-success text-white px-4">
                    Open Tool
                  </a>
                </div>
              </div>
            </div>

            {/* <!-- JSON Beautifier --> */}
            <div className="col-md-4">
              <div className="card tool-card h-100">
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-braces display-5 text-info"></i>
                  </div>
                  <h5 className="card-title fw-bold">JSON Converter</h5>
                  <p className="card-text text-muted">
                    Validate, format, and transform JSON data with advanced CSV export options
                  </p>
                  <a href="/json-beautifier" className="btn btn-info text-white px-4">
                    Open Tool
                  </a>
                </div>
              </div>
            </div>

            {/* <!-- JSON to CSV Converter --> */}
            {/* <div className="col-md-4">
              <div className="card tool-card h-100">
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-filetype-csv display-5 text-success"></i>
                  </div>
                  <h5 className="card-title fw-bold">JSON to CSV Converter</h5>
                  <p className="card-text text-muted">
                    Convert JSON data to CSV format for easy import into spreadsheets.
                  </p>
                  <a href="/json-to-csv" className="btn btn-success text-white px-4">
                    Open Tool
                  </a>
                </div>
              </div>
            </div> */}



            {/* <!-- QR Code Generator --> */}
            <div className="col-md-4">
              <div className="card tool-card h-100">
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-qr-code display-5 text-info"></i>
                  </div>
                  <h5 className="card-title fw-bold">QR Code Generator</h5>
                  <p className="card-text text-muted">
                    Create custom QR codes for links, text, and more.
                  </p>
                  <a href="/qr-code-generator" className="btn btn-info text-white px-4">
                    Open Tool
                  </a>
                </div>
              </div>
            </div>



          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
