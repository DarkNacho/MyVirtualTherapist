import React from "react";
import Summary from "./Summary/Summary";
import RealTimeDashboard from "./RealTime/RealTime";

const DashboardPage: React.FC = () => {
  return (
    <>
      <h1>Dashboard</h1>
      <p>Hello World</p>
      <RealTimeDashboard />
    </>
  );
};

export default DashboardPage;
