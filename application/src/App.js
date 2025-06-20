import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route, Redirect, useLocation, useHistory } from "react-router-dom";
import routesAndMenuItems from "routes.js";
import Layout from "layout/Layout";
import Login from "views/default/Login";
import StartTest from "views/default/StartTest";
import TestResults from "views/default/TestResults";
import NotFound from "views/default/NotFound";
import { checkAuth } from "auth/authSlice";
import DrilluStudentPortal from "views/default/DrilluStudentPortal";
import DrillUPortalSkeleton from "components/skeletons/DrillUPortalSkeleton";
import "./App.css";

const App = () => {
  const { currentUser, isLogin, loading } = useSelector((state) => state.auth);
  const [showPortalSkeleton, setShowPortalSkeleton] = useState(false);
  const [portalLoaded, setPortalLoaded] = useState(false);
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

  const pathCollegeId = location.pathname.split("/")[1];
  const cachedCollegeId = sessionStorage.getItem("collegeId");
  const activeCollegeId = pathCollegeId || cachedCollegeId;

  // Check if we're on the portal page (no college ID in URL)
  const isPortalPage = !pathCollegeId && !cachedCollegeId;

  useEffect(() => {
    // Only show portal skeleton if we're on the main portal page
    if (isPortalPage) {
      setShowPortalSkeleton(true);
      setPortalLoaded(false);
      
      // Show skeleton for longer duration and then load portal
      const timer = setTimeout(() => {
        setShowPortalSkeleton(false);
        setPortalLoaded(true);
      }, 1500); // Show skeleton for 1.5 seconds
      
      return () => clearTimeout(timer);
    } else {
      // For other pages with college ID, check auth immediately
      if (activeCollegeId) {
        dispatch(checkAuth());
      }
    }
  }, [dispatch, isPortalPage, activeCollegeId]);

  useEffect(() => {
    if (!isLogin && location.pathname !== `/${activeCollegeId}/login` && activeCollegeId) {
      const loginPath = `/${activeCollegeId}/login`;
      
      sessionStorage.removeItem('authToken');
      localStorage.removeItem('authToken');
      history.replace(loginPath);
      
      const preventBack = (e) => {
        if (!isLogin) {
          e.preventDefault();
          history.replace(loginPath);
        }
      };
      
      window.addEventListener('popstate', preventBack);
      return () => window.removeEventListener('popstate', preventBack);
    }
  }, [isLogin, location.pathname, activeCollegeId, history]);

  // Show portal skeleton ONLY for the main portal page
  if (isPortalPage && showPortalSkeleton) {
    return <DrillUPortalSkeleton />;
  }

  // Show portal content ONLY after skeleton is done
  if (isPortalPage && portalLoaded) {
    return <DrilluStudentPortal />;
  }

  // Handle missing college ID redirect
  if (!pathCollegeId && cachedCollegeId) {
    return <Redirect to={`/${cachedCollegeId}${location.pathname}`} />;
  }

  // Handle completely invalid access - show portal directly (no skeleton for invalid access)
  if (!activeCollegeId) {
    return <DrilluStudentPortal />;
  }

  const replaceCollegeIdInPath = (path) => {
    return path.replace(/:collegeId/g, activeCollegeId);
  };

  const validateTestResultsParams = (params) => {
    const { collegeId, courseId, testId, moduleId } = params;
    return collegeId && courseId && testId && moduleId;
  };

  const validateStartTestParams = (params) => {
    const { collegeId, courseId, testId, moduleId } = params;
    return collegeId && courseId && testId && moduleId;
  };

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
      {/* Login Route */}
      <Route
        exact
        path="/:collegeId/login"
        render={(props) => {
          return isLogin ? (
            <Redirect to={replaceCollegeIdInPath("/:collegeId/dashboard")} />
          ) : (
            <Login {...props} />
          );
        }}
      />

      {/* Test Results Route */}
      <Route
        exact
        path="/:collegeId/tests/:courseId/:testId/:moduleId/results"
        render={(props) => {
          if (!isLogin) {
            return (
              <Redirect 
                to={{
                  pathname: `/${activeCollegeId}/login`,
                  state: { from: props.location }
                }}
              />
            );
          }
          
          if (!validateTestResultsParams(props.match.params)) {
            return renderInvalidRoute("results", "The test results page was accessed with invalid parameters.");
          }
          
          return <TestResults {...props} />;
        }}
      />

      {/* Start Test Route */}
      <Route
        exact
        path="/:collegeId/tests/:courseId/:testId/:moduleId/start"
        render={(props) => {
          if (!isLogin) {
            return (
              <Redirect 
                to={{
                  pathname: `/${activeCollegeId}/login`,
                  state: { from: props.location }
                }}
              />
            );
          }
          
          if (!validateStartTestParams(props.match.params)) {
            return renderInvalidRoute("test", "The test page was accessed with invalid parameters.");
          }
          
          return <StartTest {...props} />;
        }}
      />

      {/* Main App Routes with Layout */}
      <Route path="/:collegeId">
        {isLogin ? (
          <Layout>
            <Switch>
              {routesAndMenuItems.availableRoutes
                .filter(route => 
                  !route.path.includes('/start') && 
                  !route.path.includes('/results')
                )
                .map((route) => (
                  <Route
                    key={route.path}
                    exact={route.exact !== false}
                    path={route.path}
                    render={(props) => <route.component {...props} />}
                  />
                ))}
              
              <Route
                path="/:collegeId/*"
                render={() => <NotFound />}
              />
              
              <Route
                path="*"
                render={() => <Redirect to={`/${activeCollegeId}/dashboard`} />}
              />
            </Switch>
          </Layout>
        ) : (
          // Show auth required message immediately without loading spinner
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

      {/* Global Fallback Route */}
      <Route
        path="*"
        render={() => {
          const pathParts = location.pathname.split('/');
          const potentialCollegeId = pathParts[1];
          
          if (potentialCollegeId && potentialCollegeId.length > 0 && potentialCollegeId !== 'undefined') {
            if (/^[a-zA-Z0-9_-]+$/.test(potentialCollegeId)) {
              sessionStorage.setItem("collegeId", potentialCollegeId);
              return <Redirect to={`/${potentialCollegeId}/login`} />;
            }
          }
          
          return <NotFound />;
        }}
      />
    </Switch>
  );
};

export default App;