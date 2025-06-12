import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import DrilluLogo from 'components/DrilluLogo';
import { fetchDashboardData } from 'store/slices/dashboardSlice';

const GlobalUserHeader = ({ 
  showBackButton = false, 
  onBackClick = null, 
  backButtonVariant = "outline-primary",
  backButtonText = "Back",
  customTitle = null,
  hideOnMobile = false,
  className = "",
  showLogo = false // Changed default to false to remove logo from header
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { collegeId } = useParams();
  const location = useLocation();
  
  const { currentStudent, status } = useSelector((state) => state.dashboard);

  // Auto-fetch dashboard data if student info is not available
  useEffect(() => {
    if (!currentStudent && status === "idle") {
      console.log("🔄 Auto-fetching dashboard data for user info");
      dispatch(fetchDashboardData());
    }
  }, [currentStudent, status, dispatch]);

  // Default back functionality
  const handleDefaultBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      // Smart back navigation based on current path
      const pathParts = location.pathname.split('/').filter(Boolean);
      
      if (pathParts.length > 2) {
        // If we're deep in navigation, go back one level
        const parentPath = `/${pathParts.slice(0, -1).join('/')}`;
        history.push(parentPath);
      } else {
        // Default to dashboard
        history.push(`/${collegeId}/dashboard`);
      }
    }
  };

  // Check if nav is mobile (we'll detect based on screen size)
  const [isMobile, setIsMobile] = React.useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 992); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Don't render if hideOnMobile is true and we're on mobile
  if (hideOnMobile && isMobile) {
    return null;
  }

  return (
    <div 
      className={`sticky-header bg-white border-b border-gray-100 ${className}`}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000, // Much lower z-index so sidebar appears above it
        width: '100%',
        transition: 'all 0.3s ease',
        marginLeft: 0, // Ensure it doesn't interfere with sidebar
      }}
    >
      <div className="px-2 sm:px-5 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Left Section - Back Button and Title (Logo removed) */}
            <div className="flex items-center space-x-3">
              {/* Back Button */}
              {showBackButton && (
                <Button
                  variant={backButtonVariant}
                  size="sm"
                  onClick={handleDefaultBack}
                  className="rounded-xl flex items-center"
                  style={{ zIndex: 1005 }} // Ensure button is clickable but still below sidebar
                >
                  <CsLineIcons icon="arrow-left" className="me-2" size="15" />
                  <span className="hidden sm:inline">{backButtonText}</span>
                </Button>
              )}

              {/* Custom Title */}
              {customTitle && (
                <div className="text-lg font-semibold text-gray-900">
                  {customTitle}
                </div>
              )}
            </div>

            {/* Right Section - User Info */}
            {currentStudent && (
              <div className="flex items-center space-x-3 flex-1 justify-end min-w-0">
                
                {/* User Details - Responsive layout */}
                <div className="flex-1 min-w-0 max-w-xs text-right">
                  <div className="font-semibold text-gray-900 text-sm truncate">
                    {currentStudent.name || 'Student'}
                  </div>
                  <div className="text-xs text-gray-500 truncate hidden sm:block">
                    {currentStudent.email || 'No email provided'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalUserHeader;