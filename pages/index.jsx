"use client";
import React, { useState } from "react";
import Head from 'next/head';
import Header from "/components/Header";
import Footer from "/components/Footer";
import DailyReportGenerator from "/components/DailyReportGenerator";
import StandUpReportGenerator from "/components/StandUpReportGenerator";

const Home = () => {
  const [activeTab, setActiveTab] = useState("daily");

  return (
    <div>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
        />
      </Head>
      <Header onSelect={setActiveTab} />
      <div className="container-fluid">
        {activeTab === "daily" && <DailyReportGenerator />}
        {activeTab === "standup" && <StandUpReportGenerator />}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
