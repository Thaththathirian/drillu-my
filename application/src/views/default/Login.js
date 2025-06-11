import React, { useEffect, useState, useRef } from "react";
import { NavLink, useHistory, useLocation, Redirect } from "react-router-dom";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { login } from "auth/authSlice";
import LayoutFullpage from "layout/LayoutFullpage";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import HtmlHead from "components/html-head/HtmlHead";
import InvalidAccess from "./DrilluStudentPortal";
import { BASE_URL } from "../../constants";

const Login = () => {
  const title = "Login";
  const description = "Login Page";
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { loading, error, isLogin } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const [collegeData, setCollegeData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [networkError, setNetworkError] = useState(null);
  const formRef = useRef(null);

  console.log("Login Component - isLogin:");

  // Extract collegeId from the path
  const pathCollegeId = location.pathname.split("/")[1];

  // Cache collegeId in session storage when landing on login page
  useEffect(() => {
    if (pathCollegeId) {
      sessionStorage.setItem("collegeId", pathCollegeId);
    }
  }, [pathCollegeId]);

  // Get collegeId from session storage if not in URL
  const cachedCollegeId = sessionStorage.getItem("collegeId");
  const activeCollegeId = pathCollegeId || cachedCollegeId;

  // Fetch college data from backend
  useEffect(() => {
    const fetchCollegeData = async () => {
      if (!activeCollegeId) return;
      
      setDataLoading(true);
      setNetworkError(null);
      
      try {
        // Fetch college metadata
        const response = await fetch(`${BASE_URL}/${activeCollegeId}/college`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === "success" && data.data) {
          setCollegeData(data.data);
          // Set logo and banner as loaded if URLs are available
          if (data.data.logo) {
            setLogoLoaded(true);
          }
          if (data.data.banner) {
            setBannerLoaded(true);
          }
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching college data:", err);
        setNetworkError(`Network error while fetching college data: ${err.message}`);
        // Fallback to old method if new API fails
        setLogoLoaded(true);
        setBannerLoaded(true);
      } finally {
        setDataLoading(false);
      }
    };

    fetchCollegeData();
  }, [activeCollegeId]);

  // If no collegeId is present in URL or cache, show access denied
  if (!activeCollegeId) {
    console.log("No collegeId found in URL or cache");
    return <InvalidAccess />;
  }

  // If URL doesn't have collegeId but we have it in cache, redirect to proper path
  if (!pathCollegeId && cachedCollegeId) {
    console.log("Redirecting to /login from login page");
    return <Redirect to={`/${cachedCollegeId}/login`} />;
  }

  // Add subtle card animation on hover
  const handleCardHover = (e, isHover) => {
    if (isHover) {
      e.currentTarget.style.transform = "translateY(-3px)";
      e.currentTarget.style.boxShadow = "0 12px 25px rgba(0,0,0,0.15)";
    } else {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
    }
  };

  // Handle logo error
  const handleLogoError = () => {
    setLogoLoaded(false);
  };

  // Handle banner error
  const handleBannerError = () => {
    setBannerLoaded(false);
  };

  // Get logo URL - prefer API data, fallback to old method
  const getLogoUrl = () => {
    if (collegeData?.logo) {
      return collegeData.logo;
    }
    return `${BASE_URL}/${activeCollegeId}/student/logo`;
  };

  // Get banner URL - prefer API data, fallback to old method
  const getBannerUrl = () => {
    if (collegeData?.banner) {
      return collegeData.banner;
    }
    return `${BASE_URL}/${activeCollegeId}/student/banner`;
  };

  // Get college name - prefer API data, fallback to default
  const getCollegeName = () => {
    if (collegeData?.name) {
      return collegeData.name;
    }
    return "College";
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    onSubmit: async (values) => {
      const result = await dispatch(login(values));
      if (!result.error) {
        const { from } = location.state || {
          from: { pathname: `/${activeCollegeId}/dashboard` },
        };
        history.replace(from);
      }
    },
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // Redirect if already authenticated
    if (isLogin) {
      const { from } = location.state || {
        from: { pathname: `/${activeCollegeId}/dashboard` },
      };
      history.replace(from);
    }
  }, [isLogin, history, location, activeCollegeId]);

  const bannerImage = (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative",
        margin: 0,
        padding: 0,
        backgroundColor: "#f4f4f4"
      }}
    >
      {dataLoading ? (
        // Loading state for banner
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f8f9fa",
            color: "#6c757d"
          }}
        >
          <div className="text-center">
            <div className="spinner-border mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading college banner...</p>
          </div>
        </div>
      ) : bannerLoaded ? (
        <img
          src={getBannerUrl()}
          alt={`${getCollegeName()} Banner`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
            margin: 0,
            padding: 0
          }}
          onError={handleBannerError}
        />
      ) : (
        // Fallback banner
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#e9ecef",
            color: "#6c757d"
          }}
        >
          <div className="text-center">
            <CsLineIcons
              icon="image"
              width={64}
              height={64}
              className="mb-3"
            />
            <p>Banner not available</p>
          </div>
        </div>
      )}
    </div>
  );

  const loginForm = (
    <div className="sw-lg-70  min-h-100 bg-foreground d-flex justify-content-center align-items-center py-5 full-page-content-right-border">
      <div className="sw-sm-55 px-sm-5 px-3" >
        {/* Single elevated card for all content */}
        <div
          className="form-card px-3 px-sm-5 pt-5 pb-6"
          ref={formRef}
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "0.75rem",
            boxShadow: focusedField
              ? "0 12px 42px rgba(0,0,0,0.2.5)"
              : "0 8px 36px rgba(0,0,0,0.2)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
          }}
          onMouseOver={(e) => {
            if (!focusedField) handleCardHover(e, true);
          }}
          onMouseOut={(e) => {
            if (!focusedField) handleCardHover(e, false);
          }}
        >
          {/* Logo section */}
          <div className="text-center mb-4">
            <div className="d-flex justify-content-center mb-3">
              <NavLink to={`/${activeCollegeId}/login`}>
                {dataLoading ? (
                  // Loading state for logo
                  <div
                    style={{
                      width: "100px",
                      height: "100px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f5f5f5",
                      borderRadius: "50%",
                      color: "#6c757d",
                    }}
                  >
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : logoLoaded ? (
                  <img
                    src={getLogoUrl()}
                    alt={`${getCollegeName()} Logo`}
                    style={{ maxHeight: "100px", width: "auto" }}
                    onError={handleLogoError}
                  />
                ) : (
                  <div
                    style={{
                      width: "100px",
                      height: "100px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f5f5f5",
                      borderRadius: "50%",
                      color: "#2499e3",
                      fontSize: "2.5rem",
                    }}
                  >
                    <CsLineIcons
                      icon="imagePlus"
                      width={32}
                      height={40}
                      viewBox="0 0 23 25"
                      stroke="#a5a5a5"
                    />
                  </div>
                )}
              </NavLink>
            </div>
            <h2 className="cta-1 mb-1 text-primary">Welcome to {getCollegeName()},</h2>
            <h2 className="cta-1 text-primary fw-bold">Let's get started!</h2>
          </div>

          {/* Instructions section */}
          <div className="text-center mb-4">
            <p className="h6">Please use your credentials to login.</p>
          </div>

          {/* Network Error alert if present */}
          {networkError && (
            <div
              className="alert alert-warning mb-4"
              style={{
                borderRadius: "0.7rem",
                boxShadow: "0 3px 10px rgba(255, 193, 7, 0.15)",
              }}
            >
              <small>{networkError}</small>
            </div>
          )}

          {/* Error alert if present */}
          {error && (
            <div
              className="alert alert-danger mb-4"
              style={{
                borderRadius: "0.7rem",
                boxShadow: "0 3px 10px rgba(220, 53, 69, 0.15)",
              }}
            >
              {error}
            </div>
          )}

          {/* Form section */}
          <form
            id="loginForm"
            className="tooltip-end-bottom"
            onSubmit={formik.handleSubmit}
          >
            <div className="mb-4">
              <div className="filled form-group tooltip-end-top">
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    className="input-icon"
                    style={{
                      position: "absolute",
                      left: "1.25rem",
                      display: "flex",
                      alignItems: "center",
                      height: "100%",
                      color: focusedField === "email" ? "#2499e3" : "#6c757d",
                      zIndex: 1,
                      transition: "transform 0.3s ease, color 0.3s ease",
                      transform:
                        focusedField === "email" ? "scale(1.25)" : "scale(1)",
                    }}
                  >
                    <CsLineIcons icon="email" />
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: "3rem",
                      height: "70%",
                      width: "1px",
                      backgroundColor:
                        focusedField === "email" ? "#b9b9b9" : "#e0e0e0",
                      zIndex: 1,
                      transition: "background-color 0.3s ease",
                    }}
                  />
                  <Form.Control
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    className="form-control-lg"
                    style={{
                      border: `1px solid ${
                        focusedField === "email" ? "#2499e3" : "#e0e0e0"
                      }`,
                      borderRadius: "0.5rem",
                      backgroundColor: "#fff",
                      paddingLeft: "4rem",
                      fontSize: "1rem",
                      height: "3rem",
                      boxShadow: "none",
                      transition:
                        "border-color 0.3s ease, box-shadow 0.3s ease",
                      boxShadow:
                        focusedField === "email"
                          ? "0 0 0 4px rgba(36, 153, 227, 0.15)"
                          : "none",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="filled form-group tooltip-end-top">
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    className="input-icon"
                    style={{
                      position: "absolute",
                      left: "1.25rem",
                      display: "flex",
                      alignItems: "center",
                      height: "100%",
                      color:
                        focusedField === "password" ? "#2499e3" : "#6c757d",
                      zIndex: 1,
                      transition: "transform 0.3s ease, color 0.3s ease",
                      transform:
                        focusedField === "password"
                          ? "scale(1.25)"
                          : "scale(1)",
                    }}
                  >
                    <CsLineIcons icon="lock-off" />
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: "3rem",
                      height: "70%",
                      width: "1px",
                      backgroundColor:
                        focusedField === "password" ? "#b9b9b9" : "#e0e0e0",
                      zIndex: 1,
                      transition: "background-color 0.3s ease",
                    }}
                  />
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    className="form-control-lg"
                    style={{
                      border: `1px solid ${
                        focusedField === "password" ? "#2499e3" : "#e0e0e0"
                      }`,
                      borderRadius: "0.5rem",
                      backgroundColor: "#fff",
                      paddingLeft: "4rem",
                      paddingRight: "3rem",
                      fontSize: "1rem",
                      height: "3rem",
                      boxShadow: "none",
                      transition:
                        "border-color 0.3s ease, box-shadow 0.3s ease",
                      boxShadow:
                        focusedField === "password"
                          ? "0 0 0 4px rgba(36, 153, 227, 0.15)"
                          : "none",
                    }}
                  />
                  <div
                    className="cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "1.25rem",
                      display: "flex",
                      alignItems: "center",
                      height: "100%",
                      color: "#6c757d",
                      zIndex: 1,
                      transition: "transform 0.3s ease, color 0.3s ease",
                      transform: showPassword ? "scale(1.15)" : "scale(1)",
                    }}
                  >
                    <CsLineIcons icon={showPassword ? "eye-off" : "eye"} />
                  </div>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              type="submit"
              disabled={loading}
              className="w-100"
              style={{
                height: "3rem",
                fontSize: "1.1rem",
                fontWeight: "600",
                marginTop: "1rem",
                borderRadius: "0.75rem",
                boxShadow: "0 8px 15px rgba(36, 153, 227, 0.25)",
                transition:
                  "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
                transform: "scale(1)",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.style.boxShadow =
                  "0 12px 20px rgba(36, 153, 227, 0.35)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 8px 15px rgba(36, 153, 227, 0.25)";
              }}
            >
              {loading ? (
                <div className="d-flex align-items-center justify-content-center">
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  <span>Logging in...</span>
                </div>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <HtmlHead title={title} description={description} />
      <LayoutFullpage left={loginForm} right={bannerImage} />
    </>
  );
};

export default Login;