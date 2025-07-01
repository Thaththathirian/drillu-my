import React, { useEffect, useState } from "react";
import { Card, Table, Button, Spinner, Alert, Badge } from "react-bootstrap";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses, clearError } from "store/slices/coursesSlice";
import GlobalUserHeader from "./GlobalUserHeader";

const Courses = () => {
  const history = useHistory();
  const location = useLocation();
  const { collegeId } = useParams();
  const dispatch = useDispatch();
  
  // Get course type from URL parameters
  const urlParams = new URLSearchParams(location.search);
  const courseTypeParam = urlParams.get('course_type');
  
  // Regular courses state
  const {
    items: courses,
    status,
    error,
  } = useSelector((state) => state.courses);

  // Get dashboard data for course types (NO separate API call)
  const { data: dashboardData } = useSelector((state) => state.dashboard);

  console.log("Courses Component - collegeId:", collegeId);
  console.log("Courses Component - courseTypeParam:", courseTypeParam);

useEffect(() => {
  if (collegeId) {
    if (courseTypeParam) {
      // UPDATED: Make API call with course_type parameter for dynamic nav items
      console.log("Dispatching fetchCourses with course_type:", courseTypeParam);
      dispatch(fetchCourses({ collegeId, courseType: courseTypeParam }));
    } else {
      // Default: fetch all courses
      console.log("Dispatching fetchCourses action for all courses");
      dispatch(fetchCourses(collegeId));
    }
  }
}, [dispatch, collegeId, courseTypeParam]);

  // Clear errors after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  // FIXED: Store referrer info when navigating to course modules
  const handleGoToTests = (courseId) => {
    // Store referrer information for back navigation
    if (courseTypeParam) {
      sessionStorage.setItem('coursesReferrer', JSON.stringify({
        courseType: courseTypeParam,
        path: location.pathname + location.search
      }));
    } else {
      sessionStorage.removeItem('coursesReferrer');
    }
    
    history.push(`/${collegeId}/course_modules/${courseId}`);
  };

  const handleGoBack = () => {
    history.push(`/${collegeId}/dashboard`);
  };

const handleRetry = () => {
  dispatch(clearError());
  if (courseTypeParam) {
    dispatch(fetchCourses({ collegeId, courseType: courseTypeParam }));
  } else {
    dispatch(fetchCourses(collegeId));
  }
};

  // const formatDate = (dateString) => {
  //   if (!dateString) return "N/A";
  //   try {
  //     return new Date(dateString).toLocaleDateString();
  //   } catch {
  //     return dateString;
  //   }
  // };
  const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return "Invalid date";
  }
};

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    try {
      return new Date(expiryDate) < new Date();
    } catch {
      return false;
    }
  };

  // Filter courses based on course type parameter
  const getFilteredCourses = () => {
    if (!courseTypeParam) {
      return courses; // Return all courses
    }
    
    // Filter courses by course_type
    return courses.filter(course => 
      course.course_type && course.course_type.toString() === courseTypeParam.toString()
    );
  };

  // Get correct title from dashboard course types
  const getPageTitle = () => {
    if (!courseTypeParam) {
      return 'Courses'; // Just "Courses" for main courses page
    }
    
    // Find the course type name from dashboard data
    if (dashboardData?.course_types) {
      const courseType = dashboardData.course_types.find(
        ct => ct.id.toString() === courseTypeParam.toString()
      );
      if (courseType) {
        return courseType.type; // Return just the type name
      }
    }
    
    return 'Courses';
  };

  const filteredCourses = getFilteredCourses();
  const pageTitle = getPageTitle();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* FIXED: GlobalUserHeader positioned correctly */}
      <GlobalUserHeader 
        showBackButton={true}
        onBackClick={handleGoBack}
        backButtonText="Back to Dashboard"
      />
      
      <div className="container-fluid px-3 py-4">
        {/* FIXED: Header Section with title in correct position */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="h4 mb-0 d-inline-block text-gray-800 font-weight-bold">
              {pageTitle}
            </h2>
          </div>
        </div>

        {/* Error Alerts */}
        {error && (
          <Alert variant="danger" className="mb-4 d-flex justify-content-between align-items-center">
            <div>
              <CsLineIcons icon="warning" size="16" className="me-2" />
              Error loading courses: {error}
            </div>
            <Button variant="outline-danger" size="sm" onClick={handleRetry}>
              <CsLineIcons icon="refresh-cw" size="14" className="me-1" />
              Retry
            </Button>
          </Alert>
        )}

        {/* Main Content */}
        <Card className="shadow-sm border-0">
          <Card.Body className="p-0">
            {/* Loading State */}
            {status === "loading" && (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" className="mb-3" />
                <p className="text-muted">Loading {pageTitle.toLowerCase()}...</p>
              </div>
            )}

            {/* Success State */}
            {status === "succeeded" && (
              <>
                {/* Desktop Table View */}
                <div className="d-none d-lg-block">
                  <div className="table-responsive">
                    <Table hover className="mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                            Course Code
                          </th>
                          <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                            Course Name
                          </th>
                          <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                            Description
                          </th>
                          <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                            Expiry Date
                          </th>
                          <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCourses.map((course, index) => (
                          <tr key={course.id || index} className="hover:bg-gray-50 transition-all duration-200">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span className="text-sm text-gray-500">
                                {course.course_code || index + 1}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="d-flex align-items-center">
                                <CsLineIcons icon="book" className="text-primary me-3" size="20" />
                                <div>
                                  <div className="font-weight-semibold text-gray-900">
                                    {course.name || "Untitled Course"}
                                  </div>
                                  
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {course.description || "No description available"}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`badge mb-1 d-flex align-items-center justify-content-center ${isExpired(course.course_expiry) ? 'bg-danger' : 'bg-success'}`}
                              style={{ 
                                minHeight: '20px', 
                                paddingTop: '0.3em', 
                                paddingBottom: '0.3em',
                                lineHeight: '1.25'
                              }}>
                                {isExpired(course.course_expiry) ? "Expired" : "Active"}
                              </span>
                              <div className="text-xs text-muted mt-1">
                                {formatDate(course.course_expiry)}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Button
                                variant={isExpired(course.course_expiry) ? "outline-secondary" : "primary"}
                                size="sm"
                                onClick={() => handleGoToTests(course.id)}
                                disabled={isExpired(course.course_expiry)}
                                className="me-2"
                              >
                                <CsLineIcons 
                                  icon={isExpired(course.course_expiry) ? "lock" : "play"} 
                                  size="14" 
                                  className="me-1" 
                                />
                                {isExpired(course.course_expiry) ? "Expired" : "View Modules"}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>

                {/* Mobile Card View */}
                <div className="d-lg-none">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    {filteredCourses.map((course, index) => (
                      <div
                        key={course.id || index}
                        className="bg-white rounded-2xl p-4 hover:shadow-lg transition-all duration-300 h-full border"
                      >
                        <div className="flex flex-col h-full">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start flex-1">
                              <CsLineIcons icon="book" className="text-blue-600 mr-3 mt-1" size="32" />
                              <div className="flex-1 min-w-0">
                                <h5 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                                  {course.name || "Untitled Course"}
                                </h5>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  <Badge bg="primary" className="text-xs">
                                    Course #{index + 1}
                                  </Badge>
                                  <Badge 
                                    bg={isExpired(course.course_expiry) ? "danger" : "success"}
                                    className="d-flex align-items-center justify-content-center"
                                    style={{ 
                                      minHeight: '24px', 
                                      paddingTop: '0.3em', 
                                      paddingBottom: '0.3em',
                                      lineHeight: '1.25'
                                    }}
                                  >
                                    {isExpired(course.course_expiry) ? "Expired" : "Active"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex-1">
                            <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                              {course.description || "No description available"}
                            </p>
                            <div className="text-xs text-gray-500 mb-4">
                              <strong>Expiry:</strong> {formatDate(course.course_expiry)}
                            </div>
                          </div>

                          <div className="mt-auto">
                            <Button
                              variant={isExpired(course.course_expiry) ? "outline-secondary" : "primary"}
                              size="sm"
                              onClick={() => handleGoToTests(course.id)}
                              disabled={isExpired(course.course_expiry)}
                              className="w-100"
                            >
                              <CsLineIcons 
                                icon={isExpired(course.course_expiry) ? "lock" : "play"} 
                                size="14" 
                                className="me-1" 
                              />
                              {isExpired(course.course_expiry) ? "Expired" : "View Modules"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Empty State */}
                {filteredCourses.length === 0 && (
                  <div className="text-center py-5">
                    <CsLineIcons icon="book" size="48" className="text-gray-300 mb-3" />
                    <h5 className="text-gray-600 mb-2">No {pageTitle.toLowerCase()} found</h5>
                    <p className="text-gray-500">
                      {!courseTypeParam 
                        ? "There are no courses available at the moment." 
                        : `No courses found for this category.`
                      }
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Failed State */}
            {status === "failed" && (
              <div className="text-center py-5">
                <CsLineIcons icon="warning" size="48" className="text-danger mb-3" />
                <h5 className="text-gray-600 mb-2">Failed to Load Courses</h5>
                <p className="text-gray-500 mb-4">
                  There was an error loading the courses. Please try again.
                </p>
                <Button variant="primary" onClick={handleRetry}>
                  <CsLineIcons icon="refresh-cw" size="14" className="me-1" />
                  Try Again
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Courses;
