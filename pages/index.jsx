"use client";
import React from "react";

const Home = () => {

  return (
    <>
      {/* <!-- Hero Section --> */}
      <section className="hero">
        <div className="container">
          <h1>Welcome to JB Suite</h1>
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

          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
