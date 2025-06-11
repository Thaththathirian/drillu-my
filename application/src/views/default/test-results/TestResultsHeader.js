import React from "react";
import { Button } from "react-bootstrap";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import { BarChart3 } from "lucide-react";

const TestResultsHeader = ({ handleGoBack, results, title }) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
        <div className="flex items-center">
          <Button
            variant="outline-primary"
            className="me-4 rounded-xl"
            onClick={handleGoBack}
          >
            <CsLineIcons icon="arrow-left" className="me-2" size="15" />
            Back
          </Button>
          <BarChart3 className="text-blue-600 mr-4" size={32} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Test Results</h1>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-700 ml-3 mb-3">
          {title || results?.test?.title || "Loading test results..."}
        </h2>
      </div>
    </>
  );
};

export default TestResultsHeader;
