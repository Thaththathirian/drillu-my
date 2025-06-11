import React from "react";
import { Button } from "react-bootstrap";
import { ArrowLeft, BarChart3 } from "lucide-react";

const TestResultsLoading = ({
  handleGoBack,
  testId,
  courseId,
  moduleId,
  retryCount,
  maxRetries,
  message = "Loading Test Results...",
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="px-2 sm:px-5 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
            <div className="flex items-center">
              <Button
                variant="outline-primary"
                className="me-4 rounded-xl"
                onClick={handleGoBack}
              >
                <ArrowLeft className="me-2" size={15} />
                Back to Tests
              </Button>
              <BarChart3 className="text-blue-600 mr-4" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Test Results
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Loading test results...
                </p>
              </div>
            </div>
          </div>

          <div
            className="flex items-center justify-center"
            style={{ height: "60vh" }}
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
              <h5 className="text-xl font-semibold text-gray-900 mb-3">
                {message}
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
        </div>
      </div>
    </div>
  );
};

export default TestResultsLoading;
