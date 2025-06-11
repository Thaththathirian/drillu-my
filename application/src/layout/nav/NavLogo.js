import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../constants";
import classNames from "classnames";
import CsLineIcons from "cs-line-icons/CsLineIcons";
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

  // Get the appropriate logo size with consistent sizing for all modes
  const getLogoSize = () => {
    if (isHorizontal) {
      return "55px"; // Size for horizontal navbar
    } else if (isCollapsed) {
      return "50px"; // Size for collapsed sidebar
    } else {
      return "80px"; // Size for expanded sidebar
    }
  };

  // Get the appropriate container style based on mode
  const getLogoContainerStyle = () => {
    // Base styles common to all modes
    const baseStyles = {
      display: "flex",
      alignItems: "center", 
      transition: "all 0.3s ease",
    };

    if (isHorizontal) {
      // Top navbar style (for smaller screens)
      return {
        ...baseStyles,
        height: "75px",
        justifyContent: "center",
        position: "relative",
        zIndex: 1050, 
      };
    // } else if (isCollapsed) {
    //   // Collapsed sidebar style (for large screens)
    //   return {
    //     ...baseStyles,
    //     justifyContent: "center",
    //     paddingTop: "15px",
    //     paddingBottom: "15px",
    //     marginBottom: "10px",
    //   };
    } else {
      // Expanded sidebar style (for large screens)
      return {
        ...baseStyles,
        justifyContent: "center",
        paddingTop: "10px",
        paddingBottom: "5px",
        marginBottom: "5px",
      };
    }
  };

  // Common image style for both logo and fallback
  const getImageStyle = () => {
    return {
      height: getLogoSize(),
      width: getLogoSize(),
      display: "block",
      transition: "all 0.3s ease",
      borderRadius: "50%",
      objectFit: "cover",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    };
  };

  // Matching icon size proportionally to the logo size
  const getIconSize = () => {
    const size = parseInt(getLogoSize(), 10);
    const iconRatio = 0.4; // Icon takes up 60% of the container
    const iconSize = Math.round(size * iconRatio);
    return { width: iconSize, height: iconSize };
  };

  return (
    <div className="nav-logo " style={getLogoContainerStyle()}>
      <Link to={`/${activeCollegeId}/dashboard`}>
        {logoLoaded ? (
          <img
            src={`${BASE_URL}/${activeCollegeId}/student/logo`}
            alt="College Logo"
            className="logo-image"
            style={getImageStyle()}
            onError={() => {
              setLogoLoaded(false);
            }}
          />
        ) : (
          <div
            style={{
              ...getImageStyle(),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f5f5f5",
            }}
          >
            <CsLineIcons
              icon="imagePlus"
              width={getIconSize().width}
              height={getIconSize().height}
              viewBox="0 0 24 24"
              stroke="#a5a5a5"
              style={{
                transform: "translateY(-1px)", // try -1px to -2px to align center
              }}
            />
          </div>
        )}
      </Link>
    </div>
  );
};

export default NavLogo;
