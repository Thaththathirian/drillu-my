import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axiosInstance from "../../config/axios";

const StartTest = () => {
  const { testId, collegeId, courseId, moduleId } = useParams();
  const history = useHistory();
  const [testLink, setTestLink] = useState(null);
  const [shouldMountIframe, setShouldMountIframe] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Base64 decode function
  const decodeBase64URL = (encodedUrl) => {
    try {
      return atob(encodedUrl);
    } catch (error) {
      console.error('Failed to decode base64 URL:', error);
      return null;
    }
  };

  // Fetch and decode test link
  const fetchTestLink = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/get_test_link', {
        test_id: testId,
        course_id: courseId,
        module_id: moduleId
      });

      if (response.data.status === 'success') {
        const encodedUrl = response.data.data;
        const decodedUrl = decodeBase64URL(encodedUrl);
        
        if (decodedUrl) {
          setTestLink(decodedUrl);
          console.log('Decoded test URL:', decodedUrl);
        } else {
          setError('Failed to decode test URL');
        }
      } else {
        setError('Failed to fetch test link');
      }
    } catch (error) {
      console.error('Error fetching test link:', error);
      setError('Network error while fetching test link');
    } finally {
      setLoading(false);
    }
  };

  const iframePermissions = [
    "fullscreen",
    "accelerometer",
    "autoplay",
    "camera",
    "microphone",
    "encrypted-media",
    "geolocation",
  ].join("; ");

  const submitTest = React.useCallback(() => {
    axiosInstance
      .post(`/test/submit/${testId}/${courseId}/${moduleId}`, {})
      .then((response) => {
        console.log(response);
        history.push(`/${collegeId}/tests/${courseId}/${moduleId}`);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [collegeId, courseId, history, testId, moduleId]);

  const handleChallengeEvent = React.useCallback((event) => {
    if (event.data && event.data.action) {
      console.log("Challenge event received:", event.data);
      if (event.data.action === "challengeFinished") {
        submitTest();
      }
    }
  }, [submitTest]);

  useEffect(() => {
    console.log("StartTest mounted with params:", {
      testId,
      collegeId,
      courseId,
    });

    // Fetch the test link first
    fetchTestLink();

    window.addEventListener("message", handleChallengeEvent);

    return () => {
      window.removeEventListener("message", handleChallengeEvent);
    };
  }, [testId, collegeId, courseId, moduleId]);

  useEffect(() => {
    if (testLink && !loading) {
      const hasLoaded = sessionStorage.getItem("testPageLoaded");

      if (!hasLoaded) {
        console.log("First load detected, setting refresh flag");
        sessionStorage.setItem("testPageLoaded", "true");
        setTimeout(() => {
          console.log("Forcing initial page reload");
          window.location.reload();
        }, 100);
      } else {
        console.log("Page already loaded once, mounting iframe");
        setTimeout(() => {
          setShouldMountIframe(true);
        }, 500);
      }
    }
  }, [testLink, loading]);

  const handleIframeLoad = () => {
    console.log("Iframe loaded successfully");
    sessionStorage.removeItem("testPageLoaded");
  };

  if (loading) {
    return (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        zIndex: 9999,
      }}>
        Loading test...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        zIndex: 9999,
        flexDirection: "column"
      }}>
        <h2>Error Loading Test</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        zIndex: 9999,
      }}
    >
      {!shouldMountIframe && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
          zIndex: 10000
        }}>
          Preparing test environment...
        </div>
      )}
      <div style={{ flex: 1, position: "relative" }}>
        {shouldMountIframe && testLink && (
          <iframe
            key={`test-${testId}-${Date.now()}`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
            src={testLink}
            title={`Test ${testId}`}
            allow={iframePermissions}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation allow-downloads"
            onLoad={handleIframeLoad}
          />
        )}
      </div>
    </div>
  );
};

export default StartTest;