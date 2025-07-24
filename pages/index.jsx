"use client";
import React, { useState } from "react";
import Header from "/components/Header";
import DailyReportGenerator from "/components/DailyReportGenerator";
import StandUpReportGenerator from "/components/StandUpReportGenerator";

const Home = () => {
  const [activeTab, setActiveTab] = useState("daily");

  return (
    <div>
      <Header onSelect={setActiveTab} />
      <div className="container">
        {activeTab === "daily" && <DailyReportGenerator />}
        {activeTab === "standup" && <StandUpReportGenerator />}
      </div>
    </div>
  );
};

export default Home;
