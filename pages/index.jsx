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
            <div className="col-md-5">
              <div className="card tool-card h-100">
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-journal-text display-5 text-primary"></i>
                  </div>
                  <h5 className="card-title fw-bold">Daily Report Generator</h5>
                  <p className="card-text text-muted">
                    Generate and organize your daily work reports effortlessly.
                  </p>
                  <a href="/daily-report" className="btn btn-primary">Open Tool</a>
                </div>
              </div>
            </div>

            {/* <!-- Stand Up Report Generator --> */}
            <div className="col-md-5">
              <div className="card tool-card h-100">
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-clipboard-check display-5 text-success"></i>
                  </div>
                  <h5 className="card-title fw-bold">Stand Up Report Generator</h5>
                  <p className="card-text text-muted">
                    Quickly create structured team stand-up reports.
                  </p>
                  <a href="/standup-report" className="btn btn-success">Open Tool</a>
                </div>
              </div>
            </div>

            {/* <!-- Markdown Editor --> */}
            <div className="col-md-5">
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

            {/* <!-- JSON Beautifier --> */}
            <div className="col-md-5">
              <div className="card tool-card h-100">
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-braces display-5 text-info"></i>
                  </div>
                  <h5 className="card-title fw-bold">JSON Beautifier</h5>
                  <p className="card-text text-muted">
                    Format, validate, and beautify raw JSON data instantly for better readability.
                  </p>
                  <a href="/json-beautifier" className="btn btn-info text-white px-4">
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
