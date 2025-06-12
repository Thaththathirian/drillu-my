import React from 'react';
import classNames from 'classnames';
import { NavLink, useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { USE_MULTI_LANGUAGE } from 'config.js';
import { menuChangeAttrMobile, menuChangeNavClasses } from 'layout/nav/main-menu/menuSlice';

const SidebarMenuItems = React.memo(({ menuItems = [] }) =>
  menuItems.map((item, index) => <SidebarMenuItem key={`menu.${item.path}.${index}`} id={item.path} item={item} />)
);
SidebarMenuItems.displayName = 'SidebarMenuItems';

const SidebarMenuItem = ({ item, id }) => {
  const { pathname } = useLocation();
  const { formatMessage: f } = useIntl();
  const dispatch = useDispatch();
  const { attrMobile, navClasses } = useSelector((state) => state.menu);

  const isActive = item.path.startsWith('#') ? false : pathname === item.path || pathname.indexOf(`${item.path}/`) > -1;

  // **SIDEBAR AUTO-CLOSE: Function to close mobile sidebar when item is clicked**
  const handleSidebarMenuClose = () => {
    console.log("🔄 Sidebar item clicked - checking mobile state:", { attrMobile, navClasses });
    
    if (attrMobile && navClasses && navClasses['mobile-side-in']) {
      console.log("📱 Sidebar mobile menu detected as open, initiating close sequence");
      
      // Start the mobile menu closing animation sequence (same as MainMenuItems)
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
        console.log("✅ Sidebar mobile menu closed successfully");
      }, 230);
    }
  };

  // **Navigation click handler**
  const handleNavigationClick = (e) => {
    console.log("🔗 Sidebar navigation item clicked:", { path: item.path, attrMobile });
    
    // Handle mobile menu closing
    if (attrMobile) {
      // Small delay to ensure navigation starts before closing menu
      setTimeout(() => {
        handleSidebarMenuClose();
      }, 50);
    }
  };

  const getLabel = (icon, label) => (
    <>
      {icon && (
        <>
          <CsLineIcons icon={icon} className="cs-icon icon" />{' '}
        </>
      )}
      <span className="label">{USE_MULTI_LANGUAGE ? f({ id: label }) : label}</span>
    </>
  );

  if (item.subs) {
    return (
      <li>
        <NavLink 
          to={item.path} 
          className={classNames({ active: isActive })} 
          data-bs-target={item.path}
          onClick={handleNavigationClick}
        >
          {getLabel(item.icon, item.label)}
        </NavLink>
        <ul>
          <SidebarMenuItems menuItems={item.subs} />
        </ul>
      </li>
    );
  }
  if (item.isExternal) {
    return (
      <li key={id}>
        <a 
          href={item.path} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={handleNavigationClick}
        >
          {getLabel(item.icon, item.label)}
        </a>
      </li>
    );
  }
  return (
    <li>
      <NavLink 
        to={item.path} 
        className={classNames({ active: isActive })} 
        activeClassName=""
        onClick={handleNavigationClick}
      >
        {getLabel(item.icon, item.label)}
      </NavLink>
    </li>
  );
};

export default SidebarMenuItems;