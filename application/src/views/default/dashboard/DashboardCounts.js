import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchDashboardData,
  clearError,
} from "../../../store/slices/dashboardSlice";
import CsLineIcons from "cs-line-icons/CsLineIcons";

// Import components
import { StatCard, ProgressCard } from "./DashboardCards";
import CombinedSolvedStatsComponent from "./CombinedSolvedStatsComponent";
import ContributionsComponent from "./ContributionsComponent";
import ProfileHeaderComponent from "./ProfileHeaderComponent";

const DashboardCounts = () => {
  const dispatch = useDispatch();
  const { collegeId } = useParams();

  const {
    data: dashboardData,
    status,
    loading,
    error,
  } = useSelector((state) => state.dashboard);

  console.log("Dashboard Component - collegeId:", collegeId);
  console.log("Dashboard Component - status:", status);
  console.log("Dashboard Component - data:", dashboardData);

  useEffect(() => {
    console.log("Dashboard useEffect - collegeId:", collegeId);
    if (collegeId) {
      console.log("Dispatching fetchDashboardData action");
      dispatch(fetchDashboardData());
    }
  }, [dispatch, collegeId]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleRetry = () => {
    dispatch(clearError());
    dispatch(fetchDashboardData());
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || status === "failed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div
          className="bg-red-50 rounded-2xl p-6 max-w-md"
          style={{
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
        >
          <div className="text-red-800 font-medium mb-2">
            Error Loading Dashboard
          </div>
          <p className="text-red-600 mb-4">
            {error || "Failed to load dashboard data"}
          </p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            style={{
              boxShadow: "0 4px 14px 0 rgba(239, 68, 68, 0.25)",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData || status === "idle") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No dashboard data available</p>
          <button
            onClick={() => dispatch(fetchDashboardData())}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            style={{
              boxShadow: "0 4px 14px 0 rgba(59, 130, 246, 0.25)",
            }}
          >
            Load Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Safe data extraction with fallbacks
  const student = dashboardData?.student || {};
  const contributions = dashboardData?.contributions || {};
  const codingStats = dashboardData?.coding_stats || {};
  const mcqStats = dashboardData?.mcq_stats || {};
  const solvedQuestions = dashboardData?.solved_questions || {};
  const difficultyLevels = solvedQuestions?.difficulty_levels || {};
  const monthlyContributions = contributions?.monthly_contributions || [];

  const completionPercentage =
    dashboardData?.total_tests > 0
      ? Math.round(
          (dashboardData.completed_tests / dashboardData.total_tests) * 100
        )
      : 0;

  // Check what data we have
  const hasQuestions = solvedQuestions?.total?.total > 0;
  const hasCodingStats = Object.keys(codingStats).length > 0;
  const hasMcqStats = Object.keys(mcqStats).length > 0;
  const hasContributions = Object.keys(contributions).length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Profile Header */}
      <ProfileHeaderComponent student={student} />

      {/* Main Content with consistent padding */}
      <div className="px-2 sm:px-5 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto">
          {/* Page Title with Icon */}
          <div className="flex items-center mb-6">
            <CsLineIcons icon="grid" className="text-blue-600 mr-4" size="32" />
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>

          {/* Main Stats Cards - Elevated Design */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {/* Total Courses Card */}
            <div
              className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 flex items-center"
              style={{
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                transform: "translateY(0)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
              }}
            >
              <div className="flex items-center">
                <span className="text-3xl mr-4">📚</span>
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Total Courses
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData?.total_courses || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Tests Card */}
            <div
              className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300  flex items-center"
              style={{
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                transform: "translateY(0)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
              }}
            >
              <div className="flex items-center">
                <span className="text-3xl mr-4">📝</span>
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Total Tests
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData?.total_tests || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Completed Tests Card with Progress */}
            <div
              className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300  flex items-center"
              style={{
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                transform: "translateY(0)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-3xl mr-4">✅</span>
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      Completed Tests
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {dashboardData?.completed_tests || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      of {dashboardData?.total_tests || 0} total
                    </p>
                  </div>
                </div>
                <div className="relative w-16 h-16">
                  <svg
                    className="w-16 h-16 transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 35}`}
                      strokeDashoffset={`${
                        2 * Math.PI * 35 * (1 - completionPercentage / 100)
                      }`}
                      className="text-orange-500 transition-all duration-700 ease-out"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-700">
                      {completionPercentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Percentage Card */}
            <div
              className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300  flex items-center"
              style={{
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                transform: "translateY(0)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
              }}
            >
              <div className="flex items-center">
                <span className="text-3xl mr-4">🏆</span>
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Score Percentage
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {Math.round(dashboardData?.score_percentage || 0)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Combined Solved Questions and Statistics Section */}
          {(hasQuestions || hasCodingStats || hasMcqStats) && (
            <div className="mb-8">
              <CombinedSolvedStatsComponent
                solvedQuestions={solvedQuestions}
                difficultyLevels={difficultyLevels}
                codingStats={codingStats}
                mcqStats={mcqStats}
                hasCodingStats={hasCodingStats}
                hasMcqStats={hasMcqStats}
              />
            </div>
          )}

          {/* Contributions Section */}
          {hasContributions && (
            <ContributionsComponent
              contributions={contributions}
              monthlyContributions={monthlyContributions}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCounts;
