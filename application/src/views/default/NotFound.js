import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { ArrowLeft, Home, Search, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  const history = useHistory();
  const { collegeId } = useParams();
  
  // Get collegeId from URL or session storage
  const pathCollegeId = window.location.pathname.split('/')[1];
  const cachedCollegeId = sessionStorage.getItem('collegeId');
  const activeCollegeId = collegeId || pathCollegeId || cachedCollegeId;

  const handleGoHome = () => {
    if (activeCollegeId) {
      history.push(`/${activeCollegeId}/dashboard`);
    } else {
      history.push('/');
    }
  };

  const handleGoBack = () => {
    // Check if there's a valid history to go back to
    if (window.history.length > 1) {
      history.goBack();
    } else {
      handleGoHome();
    }
  };

  const handleGoToCourses = () => {
    if (activeCollegeId) {
      history.push(`/${activeCollegeId}/courses`);
    } else {
      handleGoHome();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-md w-full">
          <div
            className="bg-white rounded-3xl p-8 text-center"
            style={{
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-red-500" size={40} />
              </div>
            </div>

            {/* Error Code */}
            <div className="mb-4">
              <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
            </div>

            {/* Error Message */}
            <div className="mb-8">
              <p className="text-gray-600 text-lg mb-4">
                Oops! The page you're looking for doesn't exist.
              </p>
              <p className="text-gray-500 text-sm">
                It might have been moved, deleted, or you entered the wrong URL.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                variant="primary"
                size="lg"
                onClick={handleGoHome}
                className="w-full rounded-xl py-3"
                style={{
                  boxShadow: "0 4px 14px 0 rgba(59, 130, 246, 0.25)",
                }}
              >
                <Home className="me-2" size={18} />
                Go to Dashboard
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handleGoBack}
                  className="rounded-xl py-2"
                >
                  <ArrowLeft className="me-2" size={16} />
                  Go Back
                </Button>
                
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={handleGoToCourses}
                  className="rounded-xl py-2"
                >
                  <Search className="me-2" size={16} />
                  Browse Courses
                </Button>
              </div>
            </div>

            {/* Additional Help */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                If you think this is a mistake, please contact your administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;