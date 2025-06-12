import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Card, Button, Badge, Spinner, Alert } from "react-bootstrap";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import { useDispatch, useSelector } from "react-redux";
import { fetchTests, clearError } from "store/slices/testsSlice";
import GlobalUserHeader from "./GlobalUserHeader";

const Tests = () => {
  const { collegeId, courseId, moduleId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { tests, status, error } = useSelector((state) => state.tests);

  useEffect(() => {
    if (courseId && moduleId) {
      dispatch(fetchTests({ courseId, moduleId }));
    }
  }, [dispatch, courseId, moduleId]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleStartTest = (testId, testLink) => {
    console.log("🚀 Starting test:", {
      testId,
      testLink,
      courseId,
      moduleId,
      collegeId,
    });

    // Validate all required parameters
    if (!testId || !courseId || !moduleId || !collegeId) {
      console.error("❌ Missing parameters for test start:", {
        testId,
        courseId,
        moduleId,
        collegeId,
      });
      return;
    }

    const startPath = `/${collegeId}/tests/${courseId}/${testId}/${moduleId}/start`;
    console.log("🔗 Navigating to:", startPath);

    history.push(startPath, {
      link: testLink,
      testData: {
        testId,
        courseId,
        moduleId,
        collegeId,
      },
    });
  };

  const handleViewResults = (testId) => {
    // Validate all required parameters
    if (!testId || !courseId || !moduleId || !collegeId) {
      alert(
        "Unable to view results: Missing required information. Please try again."
      );
      return;
    }

    const resultsPath = `/${collegeId}/tests/${courseId}/${testId}/${moduleId}/results`;

    console.log("🔗 Navigating to results:", resultsPath);

    // Add small delay to ensure state is ready
    setTimeout(() => {
      history.push(resultsPath);
    }, 100);
  };

  const handleGoBack = () => {
    history.push(`/${collegeId}/course_modules/${courseId}`);
  };

  const handleRetry = () => {
    dispatch(clearError());
    dispatch(fetchTests({ courseId, moduleId }));
  };

  const getTestStatus = (test) => {
    // Check if test has a future start date
    if (test.start_date) {
      const startDate = new Date(test.start_date);
      const now = new Date();
      if (startDate > now) {
        return "yet_to_start";
      }
    }

    if (
      test.submitted ||
      test.finished === "1" ||
      test.status === "completed"
    ) {
      return "completed";
    }
    if (test.status === "expired") {
      return "expired";
    }
    if (test.status === "in_progress") {
      return "in_progress";
    }
    return "not_attempted";
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <Badge bg="success" className="text-xs rounded-xl">
            Completed
          </Badge>
        );
      case "in_progress":
        return (
          <Badge bg="warning" className="text-xs rounded-xl">
            In Progress
          </Badge>
        );
      case "expired":
        return (
          <Badge bg="danger" className="text-xs rounded-xl">
            Expired
          </Badge>
        );
      case "yet_to_start":
        return (
          <Badge bg="info" className="text-xs rounded-xl">
            Yet to Start
          </Badge>
        );
      default:
        return (
          <Badge bg="secondary" className="text-xs rounded-xl">
            Not Attempted
          </Badge>
        );
    }
  };

  const getTimeUntilStart = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffMs = start - now;

    if (diffMs <= 0) return null;

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours.toString().padStart(2, '0')} Hrs`;
    } else if (minutes > 0) {
      return `${minutes.toString().padStart(2, '0')} mins`;
    } else {
      return `${seconds.toString().padStart(2, '0')} secs`;
    }
  };

  const getStatusText = (test) => {
    const testStatus = getTestStatus(test);
    const isSubmitted = test.submitted || test.finished === "1";
    
    if (testStatus === "yet_to_start") {
      return "Test has not started yet";
    }
    if (testStatus === "expired" && isSubmitted) {
      return "Test expired but submitted successfully";
    }
    if (testStatus === "expired" && !isSubmitted) {
      return "Test has expired and cannot be taken";
    }
    if (testStatus === "completed") {
      return "Test completed successfully";
    }
    if (testStatus === "in_progress") {
      return "Test is currently in progress";
    }
    return "Test not attempted yet";
  };

  const shouldShowViewResults = (test) => {
    const testStatus = getTestStatus(test);
    const isSubmitted = test.submitted || test.finished === "1";
    
    // Show view results if completed OR if expired but submitted
    return testStatus === "completed" || (testStatus === "expired" && isSubmitted);
  };

  const shouldDisableStartButton = (test) => {
    const testStatus = getTestStatus(test);
    const isSubmitted = test.submitted || test.finished === "1";
    
    // Disable if yet to start, expired and not submitted, or if completed
    return testStatus === "yet_to_start" || (testStatus === "expired" && !isSubmitted) || testStatus === "completed";
  };

  const getStartButtonText = (test) => {
    const testStatus = getTestStatus(test);
    const isSubmitted = test.submitted || test.finished === "1";
    
    if (testStatus === "yet_to_start") {
      const timeUntil = getTimeUntilStart(test.start_date);
      return timeUntil ? `Test starts in ${timeUntil}` : "Start Test";
    }
    if (testStatus === "expired" && !isSubmitted) {
      return "Not Submitted";
    }
    if (testStatus === "in_progress") {
      return "Continue Test";
    }
    return "Start Test";
  };

  const formatDuration = (minutes) => {
    if (!minutes || minutes === 0) return "No time limit";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Global User Header */}
        <GlobalUserHeader
          showBackButton={true}
          onBackClick={handleGoBack}
          backButtonText="Back to Modules"
        />

        <div className="px-2 sm:px-5 lg:px-8 py-5">
          <div className="max-w-7xl mx-auto">
            <div
              className="flex items-center justify-center"
              style={{ height: "50vh" }}
            >
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Loading tests...</p>
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
        {/* Global User Header */}
        <GlobalUserHeader
          showBackButton={true}
          onBackClick={handleGoBack}
          backButtonText="Back to Modules"
        />

        <div className="px-2 sm:px-5 lg:px-8 py-5">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex items-center mb-6">
              <CsLineIcons
                icon="clipboard-list"
                className="text-blue-600 mr-4"
                size="32"
              />
              <h1 className="text-2xl font-bold text-gray-900">Tests</h1>
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
                    Error Loading Tests
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
      {/* Global User Header */}
      <GlobalUserHeader
        showBackButton={true}
        onBackClick={handleGoBack}
        backButtonText="Back to Modules"
      />

      <div className="px-2 sm:px-5 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
            <div className="flex items-center">
              <CsLineIcons
                icon="clipboard-list"
                className="text-blue-600 mr-4"
                size="32"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tests</h1>
                <p className="text-gray-600 text-sm mt-1">
                  {tests?.length || 0} test{tests?.length !== 1 ? "s" : ""}{" "}
                  available
                </p>
              </div>
            </div>
          </div>

          {!tests || tests.length === 0 ? (
            <div
              className="bg-white rounded-2xl p-8"
              style={{
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div className="text-center">
                <CsLineIcons
                  icon="clipboard-list"
                  size="48"
                  className="text-gray-400 mx-auto mb-4"
                />
                <h5 className="text-xl font-semibold text-gray-900 mb-2">
                  No tests available
                </h5>
                <p className="text-gray-600 mb-6">
                  {status === "succeeded"
                    ? "This module doesn't have any tests yet."
                    : "Please check back later or contact your administrator."}
                </p>
                <div className="flex justify-center gap-3">
                  <Button
                    variant="outline-primary"
                    onClick={handleGoBack}
                    className="rounded-xl"
                  >
                    <CsLineIcons icon="arrow-left" className="me-2" size="15" />
                    Back to Modules
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
            /* Card-based Layout for Mobile-Friendly Display */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests.map((test, index) => {
                const testStatus = getTestStatus(test);
                const showViewResults = shouldShowViewResults(test);
                const disableStartButton = shouldDisableStartButton(test);

                return (
                  <div
                    key={test.id || index}
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
                      {/* Test Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center flex-1">
                          <CsLineIcons
                            icon="clipboard-list"
                            className="text-blue-600 mr-3"
                            size="28"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                              {test.title || test.name || `Test ${index + 1}`}
                            </h5>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {getStatusBadge(testStatus)}
                              <Badge
                                bg="secondary"
                                className="text-xs rounded-xl"
                                style={{
                                  boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                Test #{index + 1}
                              </Badge>
                            </div>
                            {/* Status Text */}
                            <p className="text-xs text-gray-500 mt-1">
                              {getStatusText(test)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Test Description */}
                      {test.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {test.description}
                        </p>
                      )}

                      {/* Test Metadata */}
                      <div className="space-y-3 mb-6 flex-grow">
                        {/* Duration and Score */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                            <div className="flex items-center mb-1">
                              <CsLineIcons
                                icon="clock"
                                className="text-blue-600 mr-2"
                                size="16"
                              />
                              <span className="text-xs font-medium text-blue-800">
                                {testStatus === "completed" ? "Time Spent" : "Duration"}
                              </span>
                            </div>
                            <div className="text-sm font-bold text-blue-900 ms-4">
                              {testStatus === "completed" && test.time_spent
                                ? `${test.time_spent} / ${formatDuration(test.duration)}`
                                : formatDuration(test.duration)}
                            </div>
                          </div>
                          <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                            <div className="flex items-center mb-1">
                              <CsLineIcons
                                icon="target"
                                className="text-green-600 mr-2"
                                size="16"
                              />
                              <span className="text-xs font-medium text-green-800">
                                {testStatus === "completed" ? "Score Earned" : "Total Score"}
                              </span>
                            </div>
                            <div className="text-sm font-bold text-green-900">
                              {testStatus === "completed" && test.earned_score
                                ? `${test.earned_score} / ${test.score || test.total_score || 0}`
                                : (test.score || test.total_score || 0)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-auto">
                        {showViewResults ? (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => {
                              console.log(
                                "🔍 View Results clicked for test:",
                                test.id
                              );
                              handleViewResults(test.id);
                            }}
                            className="rounded-xl px-4 py-2 w-100"
                            style={{
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = "translateY(-1px)";
                              e.target.style.boxShadow =
                                "0 4px 12px 0 rgba(59, 130, 246, 0.25)";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = "translateY(0)";
                              e.target.style.boxShadow = "none";
                            }}
                          >
                            <CsLineIcons
                              icon="bar-chart"
                              className="me-2"
                              size="15"
                            />
                            View Results
                          </Button>
                        ) : (
                          <Button
                            variant={disableStartButton ? "secondary" : "primary"}
                            size="sm"
                            onClick={() => !disableStartButton && handleStartTest(test.id, test.link)}
                            disabled={disableStartButton}
                            className="rounded-xl px-4 py-2 w-100"
                            style={{
                              boxShadow: disableStartButton 
                                ? "none" 
                                : "0 4px 14px 0 rgba(59, 130, 246, 0.25)",
                              transition: "all 0.2s ease",
                              opacity: disableStartButton ? 0.6 : 1,
                              cursor: disableStartButton ? "not-allowed" : "pointer"
                            }}
                            onMouseEnter={(e) => {
                              if (!disableStartButton) {
                                e.target.style.transform = "translateY(-1px)";
                                e.target.style.boxShadow =
                                  "0 6px 20px 0 rgba(59, 130, 246, 0.35)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!disableStartButton) {
                                e.target.style.transform = "translateY(0)";
                                e.target.style.boxShadow =
                                  "0 4px 14px 0 rgba(59, 130, 246, 0.25)";
                              }
                            }}
                          >
                            <CsLineIcons
                              icon={
                                testStatus === "yet_to_start"
                                  ? "clock"
                                  : testStatus === "expired" 
                                  ? "x-circle"
                                  : testStatus === "in_progress"
                                  ? "play-circle"
                                  : "play"
                              }
                              className="me-2"
                              size="15"
                            />
                            {getStartButtonText(test)}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tests;