import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../constants";
import classNames from "classnames";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import DrilluLogo from "components/DrilluLogo";
import { MENU_BEHAVIOUR, MENU_PLACEMENT } from "constants.js";

const NavLogo = () => {
  const location = useLocation();
  const pathCollegeId = location.pathname.split("/")[1];
  const cachedCollegeId = sessionStorage.getItem("collegeId");
  const activeCollegeId = pathCollegeId || cachedCollegeId;

  const { behaviourStatus, placementStatus, attrMobile } = useSelector(
    (state) => state.menu
  );
  const [logoLoaded, setLogoLoaded] = useState(true);

  // Check if sidebar is collapsed based on behaviour status
  const isCollapsed =
    behaviourStatus?.behaviourHtmlData === MENU_BEHAVIOUR.Unpinned;

  // Determine if we're in mobile/horizontal mode
  const isHorizontal =
    placementStatus?.view === MENU_PLACEMENT.Horizontal || attrMobile;

  // Get the appropriate logo dimensions based on layout (made even smaller)
  const getLogoDimensions = () => {
    if (isHorizontal) {
      // Horizontal navbar - very compact
      return { width: "80px", height: "auto" };
    } else if (isCollapsed) {
      // Collapsed sidebar - tiny
      return { width: "60px", height: "auto" };
    } else {
      // Expanded sidebar - small with padding
      return { width: "90px", height: "auto" };
    }
  };

  // Get the appropriate container style based on mode
  const getLogoContainerStyle = () => {
    // Base styles common to all modes
    const baseStyles = {
      display: "flex",
      alignItems: "center", 
      transition: "all 0.3s ease",
      justifyContent: "center",
    };

    if (isHorizontal) {
      // Top navbar style (for smaller screens) - more compact
      return {
        ...baseStyles,
        height: "50px",
        paddingLeft: "15px",
        paddingRight: "15px",
        position: "relative",
        zIndex: 1050, 
      };
    } else {
      // Sidebar style (for large screens) - with left/right padding
      return {
        ...baseStyles,
        paddingTop: "8px",
        paddingBottom: "8px",
        paddingLeft: "20px", // Added left padding
        paddingRight: "20px", // Added right padding
      };
    }
  };

  // Common image style for fallback
  const getFallbackImageStyle = () => {
    const dimensions = getLogoDimensions();
    return {
      height: "60px", // Fixed height for college logos
      width: "auto",
      maxWidth: dimensions.width,
      display: "block",
      transition: "all 0.3s ease",
      borderRadius: "8px",
      objectFit: "contain",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    };
  };

  const dimensions = getLogoDimensions();

  return (
    <div 
      className="nav-logo" 
      style={{
        ...getLogoContainerStyle(),
        position: "relative",
        zIndex: 1050 // Ensure entire nav logo container is above header
      }}
    >
      <Link to={`/${activeCollegeId}/dashboard`}>
        {/* Always show the DrilluLogo as primary */}
        <DrilluLogo
          width={dimensions.width}
          height={dimensions.height}
          className="drillu-logo"
          style={{
            transition: "all 0.3s ease",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
            position: "relative",
            zIndex: 1050 // Ensure logo and sidebar are above header
          }}
        />
        
        {/* Optionally show college logo as overlay or fallback */}
        {logoLoaded && (
          <div style={{ display: "none" }}>
            <img
              src={`${BASE_URL}/${activeCollegeId}/student/logo`}
              alt="College Logo"
              className="college-logo-fallback"
              style={getFallbackImageStyle()}
              onError={() => {
                setLogoLoaded(false);
              }}
            />
          </div>
        )}
      </Link>
    </div>
  );
};

export default NavLogo;