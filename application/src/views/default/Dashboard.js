import React from "react";
import { useParams } from "react-router-dom";
import DashboardCounts from "./dashboard/DashboardCounts";
import ErrorBoundary from "components/Errorboundary";
import GlobalUserHeader from "./GlobalUserHeader";

const Dashboard = () => {
  const { collegeId } = useParams();

  console.log("Dashboard Main Component - collegeId:", collegeId);

  return (
    <ErrorBoundary>
      <div className="dashboard-container min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Global User Header - No back button for dashboard */}
        <GlobalUserHeader showBackButton={false} />

        <DashboardCounts />
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;
