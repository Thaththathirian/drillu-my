import React, { useEffect, useState, memo, forwardRef, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { useIntl } from "react-intl";
import classNames from "classnames";
import { Collapse, Dropdown } from "react-bootstrap";
import { DEFAULT_SETTINGS, USE_MULTI_LANGUAGE } from "config.js";
import { MENU_PLACEMENT } from "constants.js";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import { layoutShowingNavMenu } from "layout/layoutSlice";
import { menuChangeCollapseAll, menuChangeAttrMobile, menuChangeNavClasses } from "./menuSlice";

const HorizontalMenuDropdownToggle = memo(
  forwardRef(({ children, onClick, href = "#", active = false }, ref) => (
    <a
      ref={ref}
      className={classNames("dropdown-toggle", { active })}
      data-toggle="dropdown"
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </a>
  ))
);

const MainMenuItem = memo(
  ({
    item,
    id,
    isSubItem = false,
    menuPlacement = DEFAULT_SETTINGS.MENU_PLACEMENT,
  }) => {
    const dispatch = useDispatch();
    const dropdownMenuRef = useRef();
    const { collapseAll, attrMobile, navClasses } = useSelector((state) => state.menu);
    const { showingNavMenu } = useSelector((state) => state.layout);
    const { pathname } = useLocation();
    const { collegeId } = useParams();
    
    // Check if we're on mobile screen size
    const [isMobileScreen, setIsMobileScreen] = useState(false);
    
   // Get dashboard data for course types
  const { data: dashboardData } = useSelector((state) => state.dashboard);
  
  // Get course types excluding id: 1
  const getDynamicCourseTypes = () => {
    if (!dashboardData?.course_types) return [];
    const filteredTypes = dashboardData.course_types.filter(courseType => courseType.id !== 1);
    
    // Only return course types if there are any after filtering out id: 1
    if (filteredTypes.length === 0) return [];
    
    return filteredTypes.map(courseType => ({
      id: courseType.id,
      type: courseType.type,
      path: `/${window.location.pathname.split('/')[1]}/courses/${courseType.id}`,
      label: courseType.type,
      icon: "book-open"
    }));
  };

    useEffect(() => {
      const checkMobileScreen = () => {
        setIsMobileScreen(window.innerWidth < 992); // lg breakpoint
      };
      
      checkMobileScreen();
      window.addEventListener('resize', checkMobileScreen);
      
      return () => window.removeEventListener('resize', checkMobileScreen);
    }, []);

    // Ensure path includes collegeId
    const getPathWithCollegeId = (path) => {
      if (path.startsWith("#")) return path;
      if (!path.includes(":collegeId")) {
        return `/${collegeId}${path}`;
      }
      return path.replace(":collegeId", collegeId);
    };

    const itemPath = getPathWithCollegeId(item.path);
    const isActive = itemPath.startsWith("#")
      ? false
      : pathname === itemPath || pathname.indexOf(`${itemPath}/`) > -1;

    const { formatMessage: f } = useIntl();
    const [verticalMenuCollapseExpanded, setVerticalMenuCollapseExpanded] =
      useState(isActive);
    const [horizontalDropdownIsOpen, setHorizontalDropdownIsOpen] =
      useState(false);

    // **MAIN FIX: Function to close mobile sidebar - only on mobile screens**
    const handleMobileMenuClose = () => {
      console.log("🔄 Checking mobile menu close - Current state:", { 
        attrMobile, 
        navClasses, 
        isMobileScreen 
      });
      
      // ONLY close mobile menu if we're actually on mobile AND mobile menu is open
      if (isMobileScreen && attrMobile && navClasses && navClasses['mobile-side-in']) {
        console.log("📱 Mobile menu detected as open, initiating close sequence");
        
        // Start the mobile menu closing animation sequence
        let newNavClasses = {
          ...navClasses,
          'mobile-side-out': true,
          'mobile-side-ready': true,
          'mobile-side-in': false,
        };
        dispatch(menuChangeNavClasses(newNavClasses));
        
        setTimeout(() => {
          newNavClasses = {
            ...newNavClasses,
            'mobile-side-ready': false,
            'mobile-side-out': false,
            'mobile-top-ready': true,
          };
          dispatch(menuChangeNavClasses(newNavClasses));
        }, 200);
        
        setTimeout(() => {
          newNavClasses = {
            ...newNavClasses,
            'mobile-top-in': true,
            'mobile-top-ready': true,
          };
          dispatch(menuChangeNavClasses(newNavClasses));
          dispatch(menuChangeAttrMobile(false));
          console.log("✅ Mobile menu closed successfully");
        }, 230);
      } else {
        console.log("ℹ️ Mobile menu close skipped:", {
          isMobileScreen,
          attrMobile,
          hasMobileSideIn: navClasses && navClasses['mobile-side-in']
        });
      }
    };

    // **Navigation click handler with conditional mobile menu close**
    const handleNavigationClick = (e) => {
      console.log("🔗 Navigation item clicked:", { 
        itemPath, 
        attrMobile, 
        isMobileScreen 
      });
      
      // Only handle mobile menu closing if we're on a mobile screen
      if (isMobileScreen && attrMobile) {
        // Small delay to ensure navigation starts before closing menu
        setTimeout(() => {
          handleMobileMenuClose();
        }, 50);
      }
      
      // Close any open dropdowns
      dispatch(layoutShowingNavMenu(""));
    };

    const getLabel = (icon, label) => (
      <>
        {icon && (
          <>
            <CsLineIcons icon={icon} size={18} className="cs-icon icon" />{" "}
          </>
        )}
        <span className="label">
          {USE_MULTI_LANGUAGE ? f({ id: label }) : label}
        </span>
      </>
    );

    const onToggleItem = (isOpen) => {
      setHorizontalDropdownIsOpen(isOpen);
    };

    const onVerticalMenuCollapseClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setVerticalMenuCollapseExpanded(!verticalMenuCollapseExpanded);
      dispatch(menuChangeCollapseAll(false));
    };

    const onHorizontalMenuDropdownToggleClick = () => {
      onToggleItem(!horizontalDropdownIsOpen);
      dispatch(layoutShowingNavMenu(""));
    };

    useEffect(() => {
      if (showingNavMenu !== "" && horizontalDropdownIsOpen) {
        onToggleItem(false);
      }
    }, [showingNavMenu, horizontalDropdownIsOpen]);

    if (
      item.subs &&
      menuPlacement === MENU_PLACEMENT.Horizontal &&
      !item.megaParent
    ) {
      return (
        <Dropdown
          as="li"
          key={id}
          onToggle={onToggleItem}
          className={classNames({ mega: item.mega })}
          show={horizontalDropdownIsOpen}
        >
          <Dropdown.Toggle
            as={HorizontalMenuDropdownToggle}
            onClick={onHorizontalMenuDropdownToggleClick}
            href={itemPath}
            active={isActive}
          >
            {getLabel(item.icon, item.label)}
          </Dropdown.Toggle>
          <Dropdown.Menu
            ref={dropdownMenuRef}
            renderOnMount
            as="ul"
            align="left"
            className={classNames("opacityIn", {
              "row align-items-start": item.mega,
              [`row-cols-${item.subs.length}`]: item.mega,
            })}
            popperConfig={{
              strategy: item.mega ? "fixed" : "absolute",
              modifiers: [
                {
                  name: "computeStyles",
                  options: {
                    gpuAcceleration: true,
                    adaptive: false,
                    roundOffsets: ({ x, y }) => {
                      if (item.mega) {
                        try {
                          return {
                            x: Math.round(
                              (window.innerWidth -
                                dropdownMenuRef.current.clientWidth) /
                                2 -
                                8
                            ),
                            y: y + 7,
                          };
                        } catch (e) {
                          console.warn("error:", e);
                        }
                      }
                      if (isSubItem) {
                        return { x, y: y - 34 };
                      }
                      return { x, y: y + 2 };
                    },
                  },
                },
              ],
            }}
          >
            <MainMenuItems
              menuItems={item.subs}
              menuPlacement={menuPlacement}
              isSubItem
            />
          </Dropdown.Menu>
        </Dropdown>
      );
    }
    if (item.subs && menuPlacement === MENU_PLACEMENT.Horizontal) {
      return (
        <li className="dropdown col d-flex flex-column">
          <NavLink
            to={itemPath}
            className={classNames("dropdown-toggle", { active: isActive })}
            onClick={handleNavigationClick}
          >
            {getLabel(item.icon, item.label)}
          </NavLink>
          <ul>
            <MainMenuItems
              menuItems={item.subs}
              menuPlacement={menuPlacement}
              isSubItem
            />
          </ul>
        </li>
      );
    }
    if (item.subs && menuPlacement === MENU_PLACEMENT.Vertical) {
      return (
        <li>
          <a
            href={itemPath}
            data-bs-toggle="collapse"
            role="button"
            className={classNames({ active: isActive })}
            aria-expanded={verticalMenuCollapseExpanded && !collapseAll}
            onClick={onVerticalMenuCollapseClick}
          >
            {getLabel(item.icon, item.label)}
          </a>
          <Collapse in={verticalMenuCollapseExpanded && !collapseAll}>
            <ul>
              <MainMenuItems
                menuItems={item.subs}
                menuPlacement={menuPlacement}
                isSubItem
              />
            </ul>
          </Collapse>
        </li>
      );
    }
    if (item.isExternal) {
    return (
      <li key={id}>
        <a href={itemPath} target="_blank" rel="noopener noreferrer" onClick={handleNavigationClick}>
          {getLabel(item.icon, item.label)}
        </a>
      </li>
    );
  }

  // ADD THIS: Special handling for Courses menu item
  if (item.label === "Courses") {
    const courseTypes = getDynamicCourseTypes();
    const currentPath = pathname;
    const isCoursesActive = currentPath === itemPath;
    
    return (
      <>
        {/* Original Courses nav item */}
        <li>
          <NavLink
            to={itemPath}
            className={classNames({ active: isCoursesActive })}
            activeClassName=""
            onClick={handleNavigationClick}
          >
            {getLabel(item.icon, item.label)}
          </NavLink>
        </li>
        
        {/* Dynamic course type nav items - only show if there are course types */}
        {courseTypes.map((courseType) => {
          const isCourseTypeActive = currentPath.includes(`/courses/${courseType.id}`);
          return (
            <li key={`course-type-${courseType.id}`}>
              <NavLink
                to={courseType.path}
                className={classNames({ active: isCourseTypeActive })}
                activeClassName=""
                onClick={handleNavigationClick}
              >
                <CsLineIcons icon={courseType.icon} size={18} className="cs-icon icon" />{" "}
                <span className="label">{courseType.label}</span>
              </NavLink>
            </li>
          );
        })}
      </>
    );
  }

    if (!isSubItem || menuPlacement === MENU_PLACEMENT.Vertical) {
      return (
        <li>
          <NavLink
            to={itemPath}
            className={classNames({ active: isActive })}
            activeClassName=""
            onClick={handleNavigationClick}
          >
            {getLabel(item.icon, item.label)}
          </NavLink>
        </li>
      );
    }
    if (menuPlacement === MENU_PLACEMENT.Horizontal && item.megaParent) {
      return (
        <li className="col d-flex flex-column">
          <NavLink
            to={itemPath}
            className={classNames({ active: isActive })}
            activeClassName=""
            onClick={handleNavigationClick}
          >
            {getLabel(item.icon, item.label)}
          </NavLink>
        </li>
      );
    }
    return (
      <Dropdown.Item as="li">
        <NavLink
          to={itemPath}
          className={classNames({ active: isActive })}
          activeClassName=""
          onClick={handleNavigationClick}
        >
          {getLabel(item.icon, item.label)}
        </NavLink>
      </Dropdown.Item>
    );
  }
);

MainMenuItem.displayName = "MainMenuItem";

const MainMenuItems = React.memo(
  ({
    menuItems = [],
    menuPlacement = DEFAULT_SETTINGS.MENU_PLACEMENT,
    isSubItem = false,
  }) =>
    menuItems.map((item, index) => (
      <MainMenuItem
        key={`menu.${item.path}.${index}`}
        id={item.path}
        item={item}
        menuPlacement={menuPlacement}
        isSubItem={isSubItem}
      />
    ))
);

MainMenuItems.displayName = "MainMenuItems";

export default React.memo(MainMenuItems);