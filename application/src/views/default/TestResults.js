import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";
import { ArrowLeft, BarChart3, AlertCircle, RefreshCw, ClipboardX  } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTestResults,
  clearError,
  clearTestResults,
  initializeTestResults,
  forceRefreshTestResults,
  resetToIdle,
} from "../../store/slices/testResultsSlice";

// Import Layout component and GlobalUserHeader
import Layout from "layout/Layout";
import TestResultsContent from "./test-results/TestResultsContent";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import GlobalUserHeader from "./GlobalUserHeader";
import { cacheHelpers } from "../../utils/apiCache";

const TestResults = () => {
  const { collegeId, testId, courseId, moduleId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { results, status, error, isInitialized, isCached } = useSelector(
    (state) => state.testResults
  );

  const [isMounting, setIsMounting] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // Refs for cleanup and tracking
  const isMounted = useRef(true);
  const hasFetched = useRef(false);
  const currentParamsString = `${testId}-${courseId}-${moduleId}`;
  const [lastParamsString, setLastParamsString] = useState(currentParamsString);
  const paramsChanged = currentParamsString !== lastParamsString;

  console.log("🔍 TestResults Render:", {
    testId,
    courseId,
    moduleId,
    collegeId,
    status,
    hasResults: !!results,
    error,
    isInitialized,
    retryCount,
    hasFetched: hasFetched.current,
    resultTestId: results?.test?.id,
    isMounting,
    isCached,
    paramsChanged,
  });

  // Validate parameters
  const hasValidParams = collegeId && testId && courseId && moduleId;

  // Enhanced data validation
  const hasCorrectData = React.useMemo(() => {
    if (!results || !results.test || !testId) {
      console.log("❌ No results or test data");
      return false;
    }

    const resultTestId = String(results.test.id);
    const currentTestId = String(testId);
    const resultCourseId = String(results.course?.id || "");
    const currentCourseId = String(courseId);
    const resultModuleId = String(results.module?.id || "");
    const currentModuleId = String(moduleId);

    const isCorrect =
      resultTestId === currentTestId &&
      resultCourseId === currentCourseId &&
      resultModuleId === currentModuleId;

    console.log("🔍 Data validation:", {
      resultTestId,
      currentTestId,
      resultCourseId,
      currentCourseId,
      resultModuleId,
      currentModuleId,
      isCorrect,
    });

    return isCorrect;
  }, [results, testId, courseId, moduleId]);

  // Render decision logic
  const shouldShowResults =
    !isMounting && hasValidParams && hasCorrectData && status === "succeeded";

  const shouldShowLoading =
    isMounting ||
    (hasValidParams &&
      (status === "loading" ||
        (!hasCorrectData && status === "idle" && !error)));

  const shouldShowError =
    !isMounting && hasValidParams && (error || status === "failed");

  const shouldShowNoData =
    !isMounting &&
    hasValidParams &&
    !hasCorrectData &&
    !error &&
    status === "succeeded" &&
    !shouldShowLoading;

  console.log("🎯 Render decisions:", {
    hasValidParams,
    hasCorrectData,
    shouldShowResults,
    shouldShowLoading,
    shouldShowError,
    shouldShowNoData,
    status,
    isMounting,
    paramsChanged,
  });

  // Navigation handlers
  const handleGoBack = useCallback(() => {
    if (!isMounted.current) return;
    console.log("🔙 Navigating back to tests");
    const backPath = `/${collegeId}/tests/${courseId}/${moduleId}`;
    history.push(backPath);
  }, [collegeId, courseId, moduleId, history]);

  const handleRetry = useCallback(() => {
    if (!isMounted.current || retryCount >= maxRetries) return;

    console.log(`🔄 Retry attempt ${retryCount + 1}/${maxRetries}`);
    setRetryCount((prev) => prev + 1);
    hasFetched.current = false;

    // Reset error state and clear previous results
    dispatch(clearError());
    dispatch(clearTestResults());
    dispatch(resetToIdle());

    // Force fetch with new parameters
    if (hasValidParams) {
      console.log("📡 Dispatching fetchTestResults for retry...");
      dispatch(initializeTestResults({ testId, courseId, moduleId }));
      dispatch(
        fetchTestResults({ testId, courseId, moduleId, forceRefresh: true })
      );
      hasFetched.current = true;
    }
  }, [retryCount, dispatch, hasValidParams, testId, courseId, moduleId]);

  // Force refresh handler
  const handleForceRefresh = useCallback(() => {
    console.log("🔄 Force refreshing test results");

    // Clear cache and reset state
    dispatch(forceRefreshTestResults({ testId }));
    dispatch(clearTestResults());
    hasFetched.current = false;
    setRetryCount(0);

    // Fetch fresh data
    if (hasValidParams) {
      dispatch(initializeTestResults({ testId, courseId, moduleId }));
      dispatch(
        fetchTestResults({ testId, courseId, moduleId, forceRefresh: true })
      );
      hasFetched.current = true;
    }
  }, [dispatch, testId, courseId, moduleId, hasValidParams]);

  // Handle parameter changes
  useEffect(() => {
    if (paramsChanged && lastParamsString !== "") {
      console.log("🧹 Parameters changed, clearing previous test results");
      dispatch(clearTestResults());
      hasFetched.current = false;
      setRetryCount(0);
    }
    setLastParamsString(currentParamsString);
  }, [currentParamsString, paramsChanged, lastParamsString, dispatch]);

  // Main effect for data fetching
  useEffect(() => {
    const mountingTimer = setTimeout(() => {
      setIsMounting(false);
    }, 100);

    // Early return if invalid params
    if (!hasValidParams) {
      console.error("❌ Invalid route parameters:", {
        collegeId,
        testId,
        courseId,
        moduleId,
      });
      setTimeout(() => {
        if (isMounted.current) {
          const fallbackPath = collegeId
            ? `/${collegeId}/courses`
            : "/demo99/courses";
          history.replace(fallbackPath);
        }
      }, 2000);
      return () => clearTimeout(mountingTimer);
    }

    // Only fetch if we need data and haven't already fetched for these params
    const needsFetch =
      !hasCorrectData && !hasFetched.current && status !== "loading";

    if (needsFetch) {
      console.log("🚀 Fetching test results for:", {
        testId,
        courseId,
        moduleId,
      });

      const fetchData = async () => {
        dispatch(initializeTestResults({ testId, courseId, moduleId }));
        await dispatch(fetchTestResults({ testId, courseId, moduleId }));
        hasFetched.current = true;
      };

      fetchData();
    } else {
      console.log("ℹ️ Skipping fetch:", {
        hasCorrectData,
        hasFetched: hasFetched.current,
        status,
        reason: hasCorrectData
          ? "Already have correct data"
          : hasFetched.current
          ? "Already fetched"
          : status === "loading"
          ? "Currently loading"
          : "Unknown",
      });
    }

    return () => clearTimeout(mountingTimer);
  }, [
    hasValidParams,
    hasCorrectData,
    status,
    testId,
    courseId,
    moduleId,
    dispatch,
    history,
    collegeId,
  ]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      console.log("🧹 TestResults component cleanup");
      isMounted.current = false;
    };
  }, []);

  // Common props for all components
  const commonProps = {
    collegeId,
    testId,
    courseId,
    moduleId,
    handleGoBack,
    handleRetry,
    handleForceRefresh,
    retryCount,
    maxRetries,
  };

  // Header Component with cache status
  const TestResultsHeader = () => (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
        <div className="flex items-center">
          <BarChart3 className="text-blue-600 mr-4" size={32} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Test Results</h1>
          </div>
        </div>
        {/* Force refresh button */}
        {shouldShowResults && (
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={handleForceRefresh}
            className="rounded-xl"
          >
            <RefreshCw className="me-2" size={14} />
            Refresh
          </Button>
        )}
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-700 ml-3 mb-3">
          {results?.test?.title || "Loading test results..."}
        </h2>
      </div>
    </>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Global User Header */}
        <GlobalUserHeader
          showBackButton={true}
          onBackClick={handleGoBack}
          backButtonText="Back to Tests"
        />

        <div className="px-2 sm:px-5 lg:px-8 py-1">
          <div className="max-w-7xl mx-auto">
            <TestResultsHeader />

            {/* Invalid parameters */}
            {!hasValidParams && (
              <div
                className="bg-red-50 rounded-2xl p-8"
                style={{
                  boxShadow:
                    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="text-center">
                  <AlertCircle
                    size={48}
                    className="text-red-600 mx-auto mb-4"
                  />
                  <h5 className="text-xl font-semibold text-gray-900 mb-2">
                    Invalid Parameters
                  </h5>
                  <p className="text-gray-600 mb-4">
                    The test results page was accessed with invalid or missing
                    parameters.
                  </p>
                  <p className="text-sm text-gray-600 mb-6">
                    Redirecting to courses page in a moment...
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button
                      variant="outline-primary"
                      onClick={handleGoBack}
                      className="rounded-xl"
                    >
                      <ArrowLeft className="me-2" size={15} />
                      Back to Tests
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Error state */}
            {shouldShowError && (
              <div
                className="bg-red-50 rounded-2xl p-8"
                style={{
                  boxShadow:
                    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="text-center">
                  <AlertCircle
                    size={48}
                    className="text-red-600 mx-auto mb-4"
                  />
                  <h5 className="text-xl font-semibold text-gray-900 mb-2">
                    Test Results not found
                  </h5>
                  <p className="text-gray-600 mb-4">
                    {error ||
                      "Unknown error occurred while fetching test results."}
                  </p>

                  {/* {retryCount >= maxRetries && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                      <p className="text-yellow-800 text-sm">
                        Maximum retry attempts reached. Please try again later
                        or contact support.
                      </p>
                    </div>
                  )} */}

                  <div className="flex justify-center gap-3">
                    <Button
                      variant="outline-primary"
                      onClick={handleGoBack}
                      className="rounded-xl"
                    >
                      <ArrowLeft className="me-2" size={15} />
                      Back to Tests
                    </Button>

                    {/* {retryCount < maxRetries && (
                      <Button
                        variant="danger"
                        onClick={handleRetry}
                        className="rounded-xl"
                      >
                        <RefreshCw className="me-2" size={15} />
                        Try Again
                        {maxRetries && ` (${maxRetries - retryCount} left)`}
                      </Button>
                    )} */}
                  </div>
                </div>
              </div>
            )}

            {/* Loading state */}
            {shouldShowLoading && (
              <div
                className="flex items-center justify-center"
                style={{ height: "60vh" }}
              >
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
                  <h5 className="text-xl font-semibold text-gray-900 mb-3">
                    Loading Test Results...
                  </h5>
                  <p className="text-gray-600 mb-4">
                    Please wait while we fetch your test results.
                    {retryCount > 0 &&
                      ` (Attempt ${retryCount + 1}/${maxRetries + 1})`}
                  </p>
                  <div className="text-xs text-gray-500 bg-gray-100 rounded-xl px-4 py-2 inline-block">
                    Test ID: {testId} | Course: {courseId} | Module: {moduleId}
                  </div>
                </div>
              </div>
            )}

            {/* No data state */}
            {shouldShowNoData && (
              <div
                className="bg-white rounded-2xl p-8"
                style={{
                  boxShadow:
                    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="text-center">
                  <ClipboardX size={48} className="text-gray-400 mx-auto mb-4" />
                  <h5 className="text-xl font-semibold text-gray-900 mb-2">
                    No Test Results Found
                  </h5>
                  <p className="text-gray-600 mb-6">
                    The test results for this test could not be found or may not
                    be available yet.
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button
                      variant="outline-primary"
                      onClick={handleGoBack}
                      className="rounded-xl"
                    >
                      <ArrowLeft className="me-2" size={15} />
                      Back to Tests
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleRetry}
                      className="rounded-xl"
                    >
                      <RefreshCw className="me-2" size={15} />
                      Reload Results
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* SUCCESS STATE - Results content */}
            {shouldShowResults && (
              <TestResultsContent
                {...commonProps}
                results={results}
                TestResultsHeader={null}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TestResults;
