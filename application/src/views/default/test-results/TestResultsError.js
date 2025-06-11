import React from "react";
import { Button } from "react-bootstrap";
import {
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
  AlertCircle,
  BarChart3,
} from "lucide-react";

const TestResultsError = ({
  handleGoBack,
  handleRetry,
  type,
  title,
  message,
  retryCount,
  maxRetries,
  showRetry = false,
  showRedirectMessage = false,
}) => {
  const getIcon = () => {
    switch (type) {
      case "invalid":
        return (
          <AlertTriangle size={48} className="text-red-600 mx-auto mb-4" />
        );
      case "nodata":
        return <BarChart3 size={48} className="text-gray-400 mx-auto mb-4" />;
      default:
        return <AlertCircle size={48} className="text-red-600 mx-auto mb-4" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "invalid":
        return "bg-red-50";
      case "nodata":
        return "bg-white";
      default:
        return "bg-red-50";
    }
  };

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
                  Error loading results
                </p>
              </div>
            </div>
          </div>

          <div
            className={`${getBackgroundColor()} rounded-2xl p-8`}
            style={{
              boxShadow:
                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div className="text-center">
              {getIcon()}
              <h5 className="text-xl font-semibold text-gray-900 mb-2">
                {title}
              </h5>
              <p className="text-gray-600 mb-4">{message}</p>

              {showRedirectMessage && (
                <p className="text-sm text-gray-600 mb-6">
                  Redirecting to courses page in a moment...
                </p>
              )}

              {retryCount >= maxRetries && showRetry && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                  <p className="text-yellow-800 text-sm">
                    Maximum retry attempts reached. Please try again later or
                    contact support.
                  </p>
                </div>
              )}

              <div className="flex justify-center gap-3">
                <Button
                  variant="outline-primary"
                  onClick={handleGoBack}
                  className="rounded-xl"
                >
                  <ArrowLeft className="me-2" size={15} />
                  Back to Tests
                </Button>

                {showRetry && retryCount < maxRetries && (
                  <Button
                    variant={type === "invalid" ? "danger" : "primary"}
                    onClick={handleRetry}
                    className="rounded-xl"
                  >
                    <RefreshCw className="me-2" size={15} />
                    {type === "invalid" ? "Try Again" : "Reload Results"}
                    {maxRetries && ` (${maxRetries - retryCount} left)`}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResultsError;
