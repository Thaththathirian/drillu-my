import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route, Redirect, useLocation, useHistory } from "react-router-dom";
import routesAndMenuItems from "routes.js";
import Layout from "layout/Layout";
import Login from "views/default/Login";
import StartTest from "views/default/StartTest";
import TestResults from "views/default/TestResults";
import NotFound from "views/default/NotFound"; // Import the new NotFound component
import { checkAuth } from "auth/authSlice";
import DrilluStudentPortal from "views/default/DrilluStudentPortal";
import Loading from "components/loading/Loading";
import "./App.css";

const App = () => {
  const { currentUser, isLogin, loading } = useSelector((state) => state.auth);
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

  console.log("App Component - isLogin:", isLogin);
  console.log("App Component - currentUser:", currentUser);
  console.log("App Component - current path:", location.pathname);
  console.log("App Component - loading:", loading);

  const pathCollegeId = location.pathname.split("/")[1];
  const cachedCollegeId = sessionStorage.getItem("collegeId");
  const activeCollegeId = pathCollegeId || cachedCollegeId;

  console.log("App Component - activeCollegeId:", activeCollegeId);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // SOLUTION 2: Add history protection for authenticated users
  useEffect(() => {
    if (!isLogin && location.pathname !== `/${activeCollegeId}/login` && activeCollegeId) {
      // If user is not logged in and trying to access protected route
      const loginPath = `/${activeCollegeId}/login`;
      
      // Clear any cached authentication data
      sessionStorage.removeItem('authToken');
      localStorage.removeItem('authToken');
      
      // Replace current history entry
      history.replace(loginPath);
      
      // Add popstate listener to prevent back navigation to protected routes
      const preventBack = (e) => {
        if (!isLogin) {
          e.preventDefault();
          history.replace(loginPath);
        }
      };
      
      window.addEventListener('popstate', preventBack);
      
      // Cleanup listener
      return () => {
        window.removeEventListener('popstate', preventBack);
      };
    }
  }, [isLogin, location.pathname, activeCollegeId, history]);

  // Handle auth loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Handle missing college ID redirect
  if (!pathCollegeId && cachedCollegeId) {
    console.log("Redirecting to /cachedCollegeId");
    return <Redirect to={`/${cachedCollegeId}${location.pathname}`} />;
  }

  // Handle completely invalid access
  if (!activeCollegeId) {
    console.log("Redirecting to /invalid-access");
    return <DrilluStudentPortal />;
  }

  const replaceCollegeIdInPath = (path) => {
    return path.replace(/:collegeId/g, activeCollegeId);
  };

  // Route validation helper
  const validateTestResultsParams = (params) => {
    const { collegeId, courseId, testId, moduleId } = params;
    return collegeId && courseId && testId && moduleId;
  };

  const validateStartTestParams = (params) => {
    const { collegeId, courseId, testId, moduleId } = params;
    return collegeId && courseId && testId && moduleId;
  };

  // SOLUTION 3: Enhanced error boundary for invalid routes
  const renderInvalidRoute = (type = "general", message = "Invalid URL parameters") => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="text-red-600 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {type === "test" ? "Invalid Test URL" : type === "results" ? "Invalid Test Results URL" : "Page Not Found"}
        </h3>
        <p className="text-gray-600 mb-4">{message}</p>
        <button 
          onClick={() => history.push(`/${activeCollegeId}/courses`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Courses
        </button>
      </div>
    </div>
  );

  return (
    <Switch>
      {/* Login Route - Always first for logged-out users */}
      <Route
        exact
        path="/:collegeId/login"
        render={(props) => {
          console.log("🔗 Login route matched");
          return isLogin ? (
            <Redirect to={replaceCollegeIdInPath("/:collegeId/dashboard")} />
          ) : (
            <Login {...props} />
          );
        }}
      />

      {/* 🎯 CRITICAL: Test Results Route - MOST SPECIFIC FIRST */}
      <Route
        exact
        path="/:collegeId/tests/:courseId/:testId/:moduleId/results"
        render={(props) => {
          console.log("🎯 TestResults route matched:", props.match.params);
          console.log("🔗 Full results path:", props.location.pathname);
          
          // Validate authentication first
          if (!isLogin) {
            console.log("🔒 Not authenticated, redirecting to login");
            return (
              <Redirect 
                to={{
                  pathname: `/${activeCollegeId}/login`,
                  state: { from: props.location }
                }}
              />
            );
          }
          
          // Validate route parameters
          if (!validateTestResultsParams(props.match.params)) {
            console.error("❌ Invalid TestResults parameters:", props.match.params);
            return renderInvalidRoute("results", "The test results page was accessed with invalid parameters.");
          }
          
          console.log("✅ TestResults route validated, rendering component");
          return <TestResults {...props} />;
        }}
      />

      {/* Start Test Route - Second most specific */}
      <Route
        exact
        path="/:collegeId/tests/:courseId/:testId/:moduleId/start"
        render={(props) => {
          console.log("🎯 StartTest route matched:", props.match.params);
          
          // Validate authentication first
          if (!isLogin) {
            console.log("🔒 Not authenticated, redirecting to login");
            return (
              <Redirect 
                to={{
                  pathname: `/${activeCollegeId}/login`,
                  state: { from: props.location }
                }}
              />
            );
          }
          
          // Validate route parameters
          if (!validateStartTestParams(props.match.params)) {
            console.error("❌ Invalid StartTest parameters:", props.match.params);
            return renderInvalidRoute("test", "The test page was accessed with invalid parameters.");
          }
          
          console.log("✅ StartTest route validated, rendering component");
          return <StartTest {...props} />;
        }}
      />

      {/* Main App Routes with Layout - For authenticated users */}
      <Route path="/:collegeId">
        {isLogin ? (
          <Layout>
            <Switch>
              {routesAndMenuItems.availableRoutes
                .filter(route => 
                  // Filter out routes that are handled outside Layout
                  !route.path.includes('/start') && 
                  !route.path.includes('/results')
                )
                .map((route) => (
                  <Route
                    key={route.path}
                    exact={route.exact !== false}
                    path={route.path}
                    render={(props) => {
                      console.log(`🔗 Layout route matched: ${route.path}`);
                      return <route.component {...props} />;
                    }}
                  />
                ))}
              
              {/* SOLUTION 4: Add 404 route within layout for authenticated users */}
              <Route
                path="/:collegeId/*"
                render={() => {
                  console.log("🔍 404 within layout for:", location.pathname);
                  return <NotFound />;
                }}
              />
              
              {/* Default redirect within layout */}
              <Route
                path="*"
                render={() => {
                  console.log("🔄 Layout fallback redirect to dashboard from:", location.pathname);
                  return <Redirect to={`/${activeCollegeId}/dashboard`} />;
                }}
              />
            </Switch>
          </Layout>
        ) : (
          // SOLUTION 5: Enhanced unauthenticated state with better UX
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-6">
              <div 
                className="bg-white rounded-3xl p-8"
                style={{
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="text-gray-600 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentication Required</h3>
                <p className="text-gray-600 mb-6">Please log in to access this page.</p>
                <button 
                  onClick={() => {
                    // Clear any existing history and redirect to login
                    window.history.replaceState(null, '', `/${activeCollegeId}/login`);
                    history.replace(`/${activeCollegeId}/login`);
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors w-full"
                  style={{
                    boxShadow: "0 4px 14px 0 rgba(59, 130, 246, 0.25)",
                  }}
                >
                  Go to Login
                </button>
              </div>
            </div>
          </div>
        )}
      </Route>

      {/* SOLUTION 6: Enhanced Global Fallback Route with 404 handling */}
      <Route
        path="*"
        render={() => {
          console.log("🔄 Global fallback route triggered for:", location.pathname);
          
          // Check if path looks like it should have a college ID
          const pathParts = location.pathname.split('/');
          const potentialCollegeId = pathParts[1];
          
          // If it looks like a college route but college ID is invalid, show 404
          if (potentialCollegeId && potentialCollegeId.length > 0 && potentialCollegeId !== 'undefined') {
            // Check if this looks like a valid college ID format
            if (/^[a-zA-Z0-9_-]+$/.test(potentialCollegeId)) {
              // Store the college ID and try to redirect to login
              sessionStorage.setItem("collegeId", potentialCollegeId);
              return <Redirect to={`/${potentialCollegeId}/login`} />;
            }
          }
          
          // For completely invalid URLs, show the main portal or 404
          return <NotFound />;
        }}
      />
    </Switch>
  );
};

export default App;