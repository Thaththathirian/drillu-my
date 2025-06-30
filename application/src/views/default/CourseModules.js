import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner, Badge, Button, Alert } from "react-bootstrap";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCourseModules,
  clearError,
  setCurrentCourseId,
} from "store/slices/courseModulesSlice";
import { Loader, Workflow } from "lucide-react";
import GlobalUserHeader from "./GlobalUserHeader";

// Circular Progress Component
const CircularProgress = ({
  percentage,
  size = 60,
  strokeWidth = 4,
  animated = true,
}) => {
  const [displayPercentage, setDisplayPercentage] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayPercentage(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayPercentage(percentage);
    }
  }, [percentage, animated]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset =
    circumference - (displayPercentage / 100) * circumference;

  const getProgressColor = (percent) => {
    if (percent === 100) return "#10b981"; // Green for completed
    if (percent >= 50) return "#3b82f6"; // Blue for in-progress
    if (percent > 0) return "#f59e0b"; // Amber for started
    return "#e5e7eb"; // Gray for not started
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getProgressColor(displayPercentage)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: animated
              ? "stroke-dashoffset 1s ease-in-out, stroke 0.3s ease"
              : "none",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold text-gray-700">
          {Math.round(displayPercentage)}%
        </span>
      </div>
    </div>
  );
};

// Progress Bar Component
const ProgressBar = ({ percentage, showLabel = true, height = 8 }) => {
  const [displayPercentage, setDisplayPercentage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayPercentage(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  const getProgressColor = (percent) => {
    if (percent === 100) return "bg-green-500";
    if (percent >= 50) return "bg-blue-500";
    if (percent > 0) return "bg-amber-500";
    return "bg-gray-300";
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-gray-600">Progress</span>
          <span className="text-xs font-semibold text-gray-700">
            {Math.round(displayPercentage)}%
          </span>
        </div>
      )}
      <div
        className="w-full bg-gray-200 rounded-full overflow-hidden"
        style={{ height: `${height}px` }}
      >
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${getProgressColor(
            displayPercentage
          )}`}
          style={{ width: `${displayPercentage}%` }}
        />
      </div>
    </div>
  );
};

// Statistics Card Component
const StatsCard = ({ icon, label, value, color = "blue" }) => {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    amber: "text-amber-600 bg-amber-50",
    gray: "text-gray-600 bg-gray-50",
  };

  return (
    <div className="flex items-center p-3 rounded-xl bg-white border border-gray-100">
      <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
        {typeof icon === "string" ? (
          <CsLineIcons icon={icon} size="20" />
        ) : (
          icon
        )}
      </div>
      <div className="ml-3">
        <div className="text-sm font-medium text-gray-900">{value}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  );
};

const CourseModules = () => {
  const history = useHistory();
  const location = useLocation();
  const { collegeId, courseId, moduleId } = useParams();
  const dispatch = useDispatch();
  
  const {
    items: modules,
    status,
    error,
    currentCourseId,
  } = useSelector((state) => state.courseModules);

  // Get dashboard data for course types
  const { data: dashboardData } = useSelector((state) => state.dashboard);

  console.log("CourseModules Component - collegeId:", collegeId);
  console.log("CourseModules Component - courseId:", courseId);
  console.log("CourseModules Component - moduleId:", moduleId);
  console.log("CourseModules Component - status:", status);
  console.log("CourseModules Component - modules:", modules);

  useEffect(() => {
    if (courseId) {
      console.log("Dispatching fetchCourseModules action");
      dispatch(setCurrentCourseId(courseId));
      dispatch(fetchCourseModules({ courseId, moduleId }));
    }
  }, [dispatch, courseId, moduleId]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleGoToModuleContent = (moduleId) => {
    history.push(`/${collegeId}/tests/${courseId}/${moduleId}`);
  };

  // FIXED: Dynamic back navigation
  const handleGoBack = () => {
    // Get the referrer URL search params to check if we came from a course type
    const referrerParams = sessionStorage.getItem('coursesReferrer');
    
    // Check if there's a stored referrer (set when navigating from courses)
    if (referrerParams) {
      const params = JSON.parse(referrerParams);
      if (params.courseType) {
        // Go back to the specific course type page
        history.push(`/${collegeId}/courses?course_type=${params.courseType}`);
        return;
      }
    }
    
    // Default to all courses
    history.push(`/${collegeId}/courses`);
  };

  // FIXED: Get dynamic back button text
  const getBackButtonText = () => {
    const referrerParams = sessionStorage.getItem('coursesReferrer');
    
    if (referrerParams) {
      const params = JSON.parse(referrerParams);
      if (params.courseType && dashboardData?.course_types) {
        const courseType = dashboardData.course_types.find(
          ct => ct.id.toString() === params.courseType.toString()
        );
        if (courseType) {
          return `Back to ${courseType.type}`;
        }
      }
    }
    
    return "Back to Courses";
  };

  const handleRetry = () => {
    dispatch(clearError());
    dispatch(fetchCourseModules({ courseId, moduleId }));
  };

  // Calculate overall statistics
  const calculateStats = () => {
    if (!modules || modules.length === 0) return null;

    const totalModules = modules.length;
    const completedModules = modules.filter(
      (m) => m.completion_percentage === 100
    ).length;
    const inProgressModules = modules.filter(
      (m) => m.completion_percentage > 0 && m.completion_percentage < 100
    ).length;
    const totalTests = modules.reduce(
      (sum, m) => sum + (m.total_tests || 0),
      0
    );
    const completedTests = modules.reduce(
      (sum, m) => sum + (m.completed_tests || 0),
      0
    );
    const overallProgress =
      totalTests > 0 ? Math.round((completedTests / totalTests) * 100) : 0;

    return {
      totalModules,
      completedModules,
      inProgressModules,
      totalTests,
      completedTests,
      overallProgress,
    };
  };

  const stats = calculateStats();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* FIXED: Global User Header with dynamic back button */}
        <GlobalUserHeader
          showBackButton={true}
          onBackClick={handleGoBack}
          backButtonText={getBackButtonText()}
        />

        <div className="px-3 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <div
              className="flex items-center justify-center"
              style={{ height: "50vh" }}
            >
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">
                  Loading course modules...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* FIXED: Global User Header with dynamic back button */}
        <GlobalUserHeader
          showBackButton={true}
          onBackClick={handleGoBack}
          backButtonText={getBackButtonText()}
        />

        <div className="px-3 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex items-center mb-6">
              <CsLineIcons
                icon="layers"
                className="text-blue-600 mr-4"
                size="32"
              />
              <h1 className="text-2xl font-bold text-gray-900">
                Course Modules
              </h1>
            </div>

            {/* Elevated Error Card */}
            <div
              className="bg-red-50 rounded-2xl p-6"
              style={{
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-red-800 font-medium mb-2">
                    Error loading course modules
                  </div>
                  <p className="text-red-600">
                    {error || "Unknown error occurred"}
                  </p>
                </div>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={handleRetry}
                  className="rounded-xl"
                >
                  <CsLineIcons icon="refresh-cw" className="me-2" size="15" />
                  Retry
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* FIXED: Global User Header with dynamic back button */}
      <GlobalUserHeader
        showBackButton={true}
        onBackClick={handleGoBack}
        backButtonText={getBackButtonText()}
      />

      <div className="px-3 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
            <div className="flex items-center">
              <CsLineIcons
                icon="layers"
                className="text-blue-600 mr-4"
                size="32"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Course Modules
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  {modules?.length || 0} module
                  {modules?.length !== 1 ? "s" : ""} available
                </p>
              </div>
            </div>
          </div>

          {/* Statistics Overview */}
          {stats && (
            <div className="mb-8">
              <div
                className="bg-white rounded-2xl p-3"
                style={{
                  boxShadow:
                    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Course Progress
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Overall completion status
                    </p>
                  </div>
                  <div className="hidden sm:block">
                    <CircularProgress
                      percentage={stats.overallProgress}
                      size={80}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <StatsCard
                    icon={<Workflow />}
                    label="Total Modules"
                    value={stats.totalModules}
                    color="amber"
                  />
                  <StatsCard
                    icon="check-circle"
                    label="Completed"
                    value={stats.completedModules}
                    color="green"
                  />
                  <StatsCard
                    icon={<Loader />}
                    label="In Progress"
                    value={stats.inProgressModules}
                    color="blue"
                  />
                  <StatsCard
                    icon="file-text"
                    label="Total Tests"
                    value={`${stats.completedTests}/${stats.totalTests}`}
                    color="gray"
                  />
                </div>

                <div className="sm:hidden mt-4 mb-2">
                  <ProgressBar percentage={stats.overallProgress} height={12} />
                </div>
              </div>
            </div>
          )}

          {!modules || modules.length === 0 ? (
            <div
              className="bg-white rounded-2xl p-8"
              style={{
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div className="text-center">
                <CsLineIcons
                  icon="layers"
                  size="48"
                  className="text-gray-400 mx-auto mb-4"
                />
                <h5 className="text-xl font-semibold text-gray-900 mb-2">
                  No modules available
                </h5>
                <p className="text-gray-600 mb-6">
                  {status === "succeeded"
                    ? "This course doesn't have any modules yet."
                    : "Please check back later or contact your administrator."}
                </p>
                <div className="flex justify-center gap-3">
                  <Button
                    variant="outline-primary"
                    onClick={handleGoBack}
                    className="rounded-xl"
                  >
                    <CsLineIcons icon="arrow-left" className="me-2" size="15" />
                    {getBackButtonText()}
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleRetry}
                    className="rounded-xl"
                    style={{
                      boxShadow: "0 4px 14px 0 rgba(59, 130, 246, 0.25)",
                    }}
                  >
                    <CsLineIcons icon="refresh-cw" className="me-2" size="15" />
                    Refresh
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module, index) => (
                <div
                  key={module.id || index}
                  className="bg-white rounded-2xl p-4 hover:shadow-lg transition-all duration-300 h-full"
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
                  <div className="flex flex-col h-full">
                    {/* Header with Progress */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-start flex-1 ">
                        <CsLineIcons
                          icon="book"
                          className="text-blue-600 mr-3 mt-1"
                          size="32"
                        />
                        <div className="flex-grow-1">
                          <h5 className="text-lg font-bold text-gray-900 mb-1 text-uppercase">
                            {module.name || "Untitled Module"}
                          </h5>
                          <Badge
                            bg="secondary"
                            className="text-xs rounded-xl"
                            style={{
                              boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            Module {index + 1}
                          </Badge>
                        </div>
                      </div>
                      <div className="ml-4">
                        <CircularProgress
                          percentage={module.completion_percentage || 0}
                          size={50}
                          strokeWidth={3}
                        />
                      </div>
                    </div>

                    {/* Progress Details */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Test Progress
                        </span>
                        <span className="text-sm text-gray-600">
                          {module.completed_tests || 0}/
                          {module.total_tests || 0}
                        </span>
                      </div>
                      <ProgressBar
                        percentage={module.completion_percentage || 0}
                        showLabel={false}
                        height={6}
                      />
                    </div>

                    {/* Module metadata */}
                    <div className="mb-4 space-y-2">
                      {module.duration && (
                        <div className="flex items-center">
                          <CsLineIcons
                            icon="clock"
                            className="text-gray-500 mr-2"
                            size="16"
                          />
                          <small className="text-gray-600">
                            Duration: {module.duration}
                          </small>
                        </div>
                      )}
                      {module.difficulty && (
                        <div className="flex items-center">
                          <CsLineIcons
                            icon="trending-up"
                            className="text-gray-500 mr-2"
                            size="16"
                          />
                          <small className="text-gray-600">
                            Difficulty: {module.difficulty}
                          </small>
                        </div>
                      )}
                      <div className="flex items-center">
                        <CsLineIcons
                          icon="check-square"
                          className="text-gray-500 mr-2"
                          size="16"
                        />
                        <small className="text-gray-600">
                          {module.total_tests || 0} test
                          {(module.total_tests || 0) !== 1 ? "s" : ""}
                        </small>
                      </div>
                      {module.status && (
                        <div className="flex items-center">
                          <CsLineIcons
                            icon={
                              module.status === "ongoing"
                                ? "play-circle"
                                : module.status === "new"
                                ? "plus-circle"
                                : "check-circle"
                            }
                            className="text-gray-500 mr-2"
                            size="16"
                          />
                          <small className="text-gray-600 capitalize">
                            {module.status}
                          </small>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end mt-auto">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleGoToModuleContent(module.id)}
                        disabled={module.status === "disabled"}
                        className="rounded-xl px-4 py-2"
                        style={{
                          boxShadow:
                            module.status === "disabled"
                              ? "none"
                              : "0 4px 14px 0 rgba(59, 130, 246, 0.25)",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          if (!e.target.disabled) {
                            e.target.style.transform = "translateY(-1px)";
                            e.target.style.boxShadow =
                              "0 6px 20px 0 rgba(59, 130, 246, 0.35)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!e.target.disabled) {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow =
                              "0 4px 14px 0 rgba(59, 130, 246, 0.25)";
                          }
                        }}
                      >
                        <CsLineIcons
                          icon="arrow-right"
                          className="me-2"
                          size="15"
                        />
                        {module.status === "disabled"
                          ? "Unavailable"
                          : "View Tests"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseModules;