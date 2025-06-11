import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { logout } from 'auth/authSlice';

const NavLogoutButton = ({ className = "", variant = "outline-danger", size = "sm" }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = async () => {
    try {
      console.log("🚪 Initiating logout process...");
      
      // Dispatch logout action
      await dispatch(logout()).unwrap();
      
      // Get college ID for redirect
      const pathCollegeId = window.location.pathname.split("/")[1];
      const cachedCollegeId = sessionStorage.getItem("collegeId");
      const activeCollegeId = pathCollegeId || cachedCollegeId;
      const loginPath = `/${activeCollegeId}/login`;
      
      // SOLUTION 1: Clear all browser history and prevent back button access
      
      // Clear session storage
      sessionStorage.clear();
      
      // Clear local storage (if any auth tokens are stored there)
      localStorage.removeItem('authToken');
      localStorage.removeItem('userSession');
      
      // Method 1: Replace entire history with login page
      if (window.history && window.history.replaceState) {
        // Clear the entire history stack
        window.history.replaceState(null, '', loginPath);
        
        // Add multiple history entries to prevent going back
        for (let i = 0; i < 10; i++) {
          window.history.pushState(null, '', loginPath);
        }
      }
      
      // Method 2: Add popstate event listener to prevent back navigation
      const preventBack = (e) => {
        e.preventDefault();
        window.history.pushState(null, '', loginPath);
        // Optionally show a message
        console.log('Back navigation prevented after logout');
      };
      
      // Add the event listener
      window.addEventListener('popstate', preventBack);
      
      // Method 3: Force navigation to login and remove the event listener after some time
      setTimeout(() => {
        window.removeEventListener('popstate', preventBack);
      }, 5000); // Remove after 5 seconds to avoid permanent blocking
      
      // Force navigation to login
      history.replace(loginPath);
      
      // Method 4: Additional safety - reload the page to clear any cached state
      setTimeout(() => {
        window.location.replace(loginPath);
      }, 100);
      
      console.log("✅ Logout completed successfully with history cleared");
      
    } catch (error) {
      console.error("❌ Logout error:", error);
      
      // Force redirect even if logout fails
      const pathCollegeId = window.location.pathname.split("/")[1];
      const cachedCollegeId = sessionStorage.getItem("collegeId");
      const activeCollegeId = pathCollegeId || cachedCollegeId;
      
      // Clear storage
      sessionStorage.clear();
      localStorage.clear();
      
      // Force reload to login page
      window.location.replace(`/${activeCollegeId}/login`);
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleLogout}
      className={className}
    >
      Logout
    </Button>
  );
};

export default NavLogoutButton;