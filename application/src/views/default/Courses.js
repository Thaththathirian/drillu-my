import React, { useEffect } from "react";
import { Card, Table, Button, Spinner, Alert, Badge } from "react-bootstrap";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses, clearError } from "store/slices/coursesSlice";
import GlobalUserHeader from "./GlobalUserHeader";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

const Courses = () => {
  const history = useHistory();
  const location = useLocation();
  const { collegeId, courseTypeId } = useParams();
  const dispatch = useDispatch();
  
  const {
    items: courses,
    status,
    error,
  } = useSelector((state) => state.courses);

  const { data: dashboardData } = useSelector((state) => state.dashboard);

  // ADD THIS: Get course type filter from URL
  const urlParams = new URLSearchParams(location.search);
  const courseTypeFilter = urlParams.get('type');
  
  // ADD THIS: Get current course type name
  const currentCourseType = dashboardData?.course_types?.find(
    ct => ct.id === parseInt(courseTypeId)
  );


  console.log("Courses Component - collegeId:", collegeId);
  console.log("Courses Component - status:", status);
  console.log("Courses Component - courses:", courses);

  useEffect(() => {
    console.log("Courses useEffect - collegeId:", collegeId);
    if (collegeId) {
      console.log("Dispatching fetchCourses action");
      dispatch(fetchCourses(collegeId));
    }
  }, [dispatch, collegeId]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleGoToTests = (courseId) => {
    history.push(`/${collegeId}/course_modules/${courseId}`);
  };

  const displayedCourses = courseTypeId 
    ? courses.filter(course => course.course_type_id === parseInt(courseTypeId))
    : courses;

  // MODIFY THIS: Update your handleGoBack function
  const handleGoBack = () => {
    if (courseTypeId) {
      // Go back to all courses if viewing specific course type
      history.push(`/${collegeId}/courses`);
    } else {
      // Go back to dashboard
      history.push(`/${collegeId}/dashboard`);
    }
  };

   const pageTitle = currentCourseType 
    ? `${currentCourseType.type}` 
    : "Courses";

  const handleRetry = () => {
    dispatch(clearError());
    dispatch(fetchCourses(collegeId));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Global User Header */}
        <GlobalUserHeader
          showBackButton={true}
          onBackClick={handleGoBack}
          backButtonText="Dashboard"
        />

        <div className="px-2 sm:px-5 lg:px-8 py-5">
          <div className="max-w-7xl mx-auto">
            <div
              className="flex items-center justify-center"
              style={{ height: "50vh" }}
            >
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Loading courses...</p>
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
          backButtonText="Dashboard"
        />

        <div className="px-2 sm:px-5 lg:px-8 py-5">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex items-center mb-6">
              <CsLineIcons
                icon="book"
                className="text-blue-600 mr-4"
                size="32"
              />
              <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
            </div>

            {/* Elevated Error Card */}
            <div
              className="bg-red-50 rounded-2xl p-6"
              style={{
                boxShadow:
                  "0 10px 25px -5p rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-red-800 font-medium mb-2">
                    Error Loading Courses
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
        customTitle={pageTitle}
        className="mb-6"
        // backButtonText="Dashboard"
      />

      {/* ADD THIS: Course type filter indicator */}
      {currentCourseType && (
        <div className="container mx-auto px-4 mb-4">
          <Badge bg="primary" className="px-3 py-2">
            <CsLineIcons icon="filter" className="me-2" size="14" />
            Showing: {currentCourseType.type}
          </Badge>
        </div>
      )}

      <div className="px-2 sm:px-5 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
            <div className="flex items-center">
              <CsLineIcons
                icon="book"
                className="text-blue-600 mr-4"
                size="32"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
                <p className="text-gray-600 text-sm mt-1">
                  {courses?.length || 0} course
                  {courses?.length !== 1 ? "s" : ""} available
                </p>
              </div>
            </div>
          </div>

          {!courses || courses.length === 0 ? (
            <div
              className="bg-white rounded-2xl p-8"
              style={{
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div className="text-center">
                <CsLineIcons
                  icon="book-open"
                  size="48"
                  className="text-gray-400 mx-auto mb-4"
                />
                <h5 className="text-xl font-semibold text-gray-900 mb-2">
                  No courses available
                </h5>
                <p className="text-gray-600 mb-6">
                  {status === "succeeded"
                    ? "There are no courses available at the moment."
                    : "Please check back later or contact your administrator."}
                </p>
                <Button
                  variant="primary"
                  onClick={handleRetry}
                  className="rounded-xl px-6 py-2"
                  style={{
                    boxShadow: "0 4px 14px 0 rgba(59, 130, 246, 0.25)",
                  }}
                >
                  <CsLineIcons icon="refresh-cw" className="me-2" size="15" />
                  Refresh Courses
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop Table View - Hidden on mobile */}
              <div
                className="bg-white rounded-2xl overflow-hidden d-none d-lg-block"
                style={{
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="overflow-x-auto">
                  <Table responsive hover className="mb-0">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                        >
                          #
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                        >
                          Course Code
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                        >
                          Course Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                        >
                          Description
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                        >
                          Expiry Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedCourses.map((course, index) => (
                        <tr
                          key={course.id || index}
                          className="hover:bg-gray-50 transition-all duration-200"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium bg-blue-100 text-blue-800"
                              style={{
                                boxShadow:
                                  "0 2px 4px 0 rgba(59, 130, 246, 0.1)",
                              }}
                            >
                              {course.course_code || `COURSE-${course.id}`}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {course.name || "Untitled Course"}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600 max-w-xs truncate">
                              {course.description || "No description available"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium ${
                                isExpired(course.course_expiry)
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                              style={{
                                boxShadow: isExpired(course.course_expiry)
                                  ? "0 2px 4px 0 rgba(239, 68, 68, 0.1)"
                                  : "0 2px 4px 0 rgba(34, 197, 94, 0.1)",
                              }}
                            >
                              {formatDate(course.course_expiry)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button
                              variant={
                                isExpired(course.course_expiry)
                                  ? "outline-secondary"
                                  : "primary"
                              }
                              size="sm"
                              onClick={() => handleGoToTests(course.id)}
                              disabled={isExpired(course.course_expiry)}
                              className="rounded-xl px-4 py-2"
                              style={{
                                boxShadow: isExpired(course.course_expiry)
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
                              {isExpired(course.course_expiry)
                                ? "Expired"
                                : "View Modules"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>

              {/* Mobile Card View - Visible on mobile and tablet */}
              <div className="d-lg-none">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayedCourses.map((course, index) => (
                    <div
                      key={course.id || index}
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
                        {/* Course Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start flex-1">
                            <CsLineIcons
                              icon="book"
                              className="text-blue-600 mr-3 mt-1"
                              size="32"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                                {course.name || "Untitled Course"}
                              </h5>
                              <div className="flex flex-wrap gap-2 mb-3">
                                <Badge
                                  bg="primary"
                                  className="text-xs rounded-xl"
                                  style={{
                                    boxShadow:
                                      "0 2px 4px 0 rgba(59, 130, 246, 0.1)",
                                  }}
                                >
                                  {course.course_code || `COURSE-${course.id}`}
                                </Badge>
                                <Badge
                                  bg="secondary"
                                  className="text-xs rounded-xl"
                                  style={{
                                    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
                                  }}
                                >
                                  Course #{index + 1}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Course Description */}
                        <div className="mb-4 flex-grow">
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {course.description ||
                              "No description available for this course."}
                          </p>
                        </div>

                        {/* Course Details */}
                        <div className="mb-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <CsLineIcons
                                icon="calendar"
                                className="text-gray-500 mr-2"
                                size="16"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                Expiry Date:
                              </span>
                            </div>
                            <Badge
                              bg={
                                isExpired(course.course_expiry)
                                  ? "danger"
                                  : "success"
                              }
                              className="text-xs rounded-xl"
                              style={{
                                boxShadow: isExpired(course.course_expiry)
                                  ? "0 2px 4px 0 rgba(239, 68, 68, 0.1)"
                                  : "0 2px 4px 0 rgba(34, 197, 94, 0.1)",
                              }}
                            >
                              {formatDate(course.course_expiry)}
                            </Badge>
                          </div>

                          {/* Additional course metadata if available */}
                          {course.instructor && (
                            <div className="flex items-center">
                              <CsLineIcons
                                icon="user"
                                className="text-gray-500 mr-2"
                                size="16"
                              />
                              <span className="text-sm text-gray-600">
                                Instructor: {course.instructor}
                              </span>
                            </div>
                          )}

                          {course.credits && (
                            <div className="flex items-center">
                              <CsLineIcons
                                icon="award"
                                className="text-gray-500 mr-2"
                                size="16"
                              />
                              <span className="text-sm text-gray-600">
                                Credits: {course.credits}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        <div className="flex justify-end mt-auto">
                          <Button
                            variant={
                              isExpired(course.course_expiry)
                                ? "outline-secondary"
                                : "primary"
                            }
                            size="sm"
                            onClick={() => handleGoToTests(course.id)}
                            disabled={isExpired(course.course_expiry)}
                            className="rounded-xl px-4 py-2"
                            style={{
                              boxShadow: isExpired(course.course_expiry)
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
                            {isExpired(course.course_expiry)
                              ? "Expired"
                              : "View Modules"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
