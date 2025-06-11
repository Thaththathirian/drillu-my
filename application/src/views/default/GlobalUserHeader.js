import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { fetchDashboardData } from 'store/slices/dashboardSlice';

const GlobalUserHeader = ({ 
  showBackButton = false, 
  onBackClick = null, 
  backButtonVariant = "outline-primary",
  backButtonText = "Back",
  customTitle = null,
  hideOnMobile = false,
  className = ""
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
    <div className={`bg-white border-b border-gray-100 mb-4 ${className}`}>
      <div className="px-2 sm:px-5 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between relative">
            {/* Left Section - Back Button and Title */}
            <div className="flex items-center space-x-3">
              {/* Back Button */}
              {showBackButton && (
                <Button
                  variant={backButtonVariant}
                  size="sm"
                  onClick={handleDefaultBack}
                  className="rounded-xl flex items-center"
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
                {/* Avatar */}
                {/* <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:flex hidden items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">
                    {currentStudent.name ? currentStudent.name.charAt(0).toUpperCase() : 'S'}
                  </span>
                </div> */}

                {/* User Details - Responsive Layout */}
                <div className="flex-1 min-w-0 max-w-xs">
                  {/* Mobile and Tablet Layout (below nav) */}
                  <div className="block lg:hidden">
                    <div className="font-semibold text-gray-900 text-sm truncate text-right">
                      {currentStudent.name || 'Student'}
                    </div>
                    <div className="text-xs text-gray-500 truncate text-right">
                      {currentStudent.email || currentStudent.registration_number || 'No info'}
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden lg:block text-right">
                    <div className="font-semibold text-gray-900 text-sm truncate">
                      {currentStudent.name || 'Student'}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {currentStudent.email || 'No email provided'}
                    </div>
                  </div>
                </div>

                {/* Registration Number Badge (Desktop only) */}
                {/* {currentStudent.registration_number && (
                  <div className="hidden xl:flex items-center px-2 py-1 bg-gray-100 rounded-lg flex-shrink-0">
                    <CsLineIcons icon="credit-card" className="text-gray-500 mr-1" size="12" />
                    <span className="text-xs font-mono text-gray-700">
                      {currentStudent.registration_number}
                    </span>
                  </div>
                )} */}

                {/* Status Indicator */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="hidden xl:block text-xs text-gray-500">Online</span>
                </div>
              </div>
            )}

            {/* Loading State for User Info */}
            {!currentStudent && status === "loading" && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="space-y-1">
                  <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-32 h-2 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            )}

            {/* Error State */}
            {!currentStudent && status === "failed" && (
              <div className="flex items-center space-x-2 text-red-600">
                <CsLineIcons icon="alert-triangle" size="16" />
                <span className="text-sm hidden sm:block">Failed to load user info</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Specific variant for different page types
export const PageHeader = ({ title, subtitle, showBack = true, children }) => {
  return (
    <GlobalUserHeader
      showBackButton={showBack}
      customTitle={
        <div>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </div>
      }
    >
      {children}
    </GlobalUserHeader>
  );
};

// Compact variant for tight spaces
export const CompactUserHeader = ({ showBack = false }) => {
  return (
    <GlobalUserHeader
      showBackButton={showBack}
      hideOnMobile={true}
    />
  );
};

export default GlobalUserHeader;