import React from "react";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { MENU_BEHAVIOUR } from "constants.js";
import { logout } from "auth/authSlice";
import { settingsChangeColor } from "store/slices/settingsSlice";
import { Nav, NavItem, NavLink } from "reactstrap";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import { menuChangeBehaviour } from "./main-menu/menuSlice";

const NavIconMenu = () => {
  const { pinButtonEnable, behaviour } = useSelector((state) => state.menu);
  const { color } = useSelector((state) => state.settings);
  const { isLogin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();
  const { collegeId } = useParams();

  const onPinButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (pinButtonEnable) {
      dispatch(
        menuChangeBehaviour(
          behaviour === MENU_BEHAVIOUR.Pinned
            ? MENU_BEHAVIOUR.Unpinned
            : MENU_BEHAVIOUR.Pinned
        )
      );
    }
    return false;
  };

  const onDisabledPinButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onLightDarkModeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      settingsChangeColor(
        color.includes("light")
          ? color.replace("light", "dark")
          : color.replace("dark", "light")
      )
    );
  };

  // ENHANCED LOGOUT FUNCTION
  const handleLogout = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      console.log("🚪 Initiating enhanced logout process...");
      
      // Step 1: Dispatch logout action to clear Redux state
      await dispatch(logout());
      
      // Step 2: Get college ID for redirect
      const pathCollegeId = window.location.pathname.split("/")[1];
      const cachedCollegeId = sessionStorage.getItem("collegeId");
      const activeCollegeId = collegeId || pathCollegeId || cachedCollegeId;
      const loginPath = `/${activeCollegeId}/login`;
      
      // Step 3: Clear all storage
      try {
        sessionStorage.clear();
        localStorage.removeItem('authToken');
        localStorage.removeItem('userSession');
        localStorage.removeItem('user');
        
        // Clear any other auth-related items
        Object.keys(localStorage).forEach(key => {
          if (key.includes('auth') || key.includes('token') || key.includes('session')) {
            localStorage.removeItem(key);
          }
        });
      } catch (storageError) {
        console.warn("Storage clearing error:", storageError);
      }
      
      // Step 4: Implement history protection strategy
      
      // Method A: Replace current history entry with login page
      if (window.history && window.history.replaceState) {
        window.history.replaceState(
          { page: 'login', timestamp: Date.now() }, 
          'Login', 
          loginPath
        );
        
        // Add multiple history entries to make back button ineffective
        for (let i = 0; i < 10; i++) {
          window.history.pushState(
            { 
              page: 'login', 
              preventBack: true, 
              loggedOut: true,
              timestamp: Date.now() + i 
            }, 
            'Login', 
            loginPath
          );
        }
      }
      
      // Method B: Add popstate event listener to intercept back navigation
      const preventBackNavigation = (event) => {
        console.log("🚫 Back navigation prevented after logout");
        
        // Prevent default back behavior
        event.preventDefault();
        
        // Force redirect to login
        window.history.pushState(
          { page: 'login', forced: true }, 
          'Login', 
          loginPath
        );
        
        // Optional: Show user feedback
        // if (window.confirm("You have been logged out. Do you want to go to the login page?")) {
        //   window.location.replace(loginPath);
        // }
      };
      
      // Add the event listener
      window.addEventListener('popstate', preventBackNavigation);
      
      // Step 5: Set up cleanup timer for the event listener
      setTimeout(() => {
        window.removeEventListener('popstate', preventBackNavigation);
        console.log("🧹 Back navigation protection removed");
      }, 30000); // Remove after 30 seconds to avoid permanent blocking
      
      // Step 6: Use React Router for immediate navigation
      history.replace(loginPath);
      
      // Step 7: Add additional safety with location.replace as fallback
      setTimeout(() => {
        if (window.location.pathname !== loginPath) {
          console.log("🔄 Fallback redirect to login");
          window.location.replace(loginPath);
        }
      }, 200);
      
      // Step 8: Clear any remaining application state
      try {
        // Dispatch any additional cleanup actions if needed
        // Example: Clear other slices
        // dispatch(clearUserData());
        // dispatch(clearApplicationState());
      } catch (cleanupError) {
        console.warn("State cleanup error:", cleanupError);
      }
      
      console.log("✅ Enhanced logout completed successfully");
      
    } catch (error) {
      console.error("❌ Logout error:", error);
      
      // Emergency fallback - force redirect even if everything fails
      const emergencyCollegeId = collegeId || 
                                 window.location.pathname.split("/")[1] || 
                                 sessionStorage.getItem("collegeId") || 
                                 "demo";
      
      // Clear storage in emergency mode
      try {
        sessionStorage.clear();
        localStorage.clear();
      } catch (e) {
        console.error("Emergency storage clear failed:", e);
      }
      
      // Force page reload to login
      window.location.replace(`/${emergencyCollegeId}/login`);
    }
  };

  return (
    <>
      <ul className="list-unstyled list-inline text-center menu-icons">
        <li className="list-inline-item">
          <a
            href="#/"
            id="pinButton"
            onClick={
              pinButtonEnable ? onPinButtonClick : onDisabledPinButtonClick
            }
            className={classNames("pin-button", { disabled: !pinButtonEnable })}
          >
            <CsLineIcons icon="lock-on" size="18" className="unpin" />
            <CsLineIcons icon="lock-off" size="18" className="pin" />
          </a>
        </li>
        <li className="list-inline-item">
          {/* <a href="#/" id="colorButton" onClick={onLightDarkModeClick}>
            <CsLineIcons icon="light-on" size="18" className="light" />
            <CsLineIcons icon="light-off" size="18" className="dark" />
          </a> */}
        </li>
        {isLogin && (
          <li className="list-inline-item">
            <a 
              href="#/" 
              onClick={handleLogout}
              title="Logout"
              className="logout-button"a
            >
              <CsLineIcons icon="logout" size="18" />
            </a>
          </li>
        )}
      </ul>
    </>
  );
};

export default React.memo(NavIconMenu);