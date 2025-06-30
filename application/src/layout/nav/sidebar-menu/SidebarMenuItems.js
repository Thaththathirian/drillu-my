import React from 'react';
import classNames from 'classnames';
import { NavLink, useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { USE_MULTI_LANGUAGE } from 'config.js';
import { menuChangeAttrMobile, menuChangeNavClasses } from 'layout/nav/main-menu/menuSlice';
import { useDynamicNavigation } from 'hooks/useDynamicNavigation';

const SidebarMenuItems = React.memo(({ menuItems = [] }) => {
  const { generateDynamicMenuItems } = useDynamicNavigation();
  const dynamicMenuItems = generateDynamicMenuItems(menuItems);

  return dynamicMenuItems.map((item, index) => 
    <SidebarMenuItem key={`menu.${item.path}.${index}`} id={item.path} item={item} />
  );
});

const SidebarMenuItem = ({ item, id }) => {
  const { pathname } = useLocation();
  const { formatMessage: f } = useIntl();
  const dispatch = useDispatch();
  const { attrMobile, navClasses } = useSelector((state) => state.menu);

  const isActive = item.path.startsWith('#') 
    ? false 
    : pathname === item.path || pathname.indexOf(`${item.path}/`) > -1 ||
      (item.subs && item.subs.some(sub => pathname === sub.to || pathname.indexOf(`${sub.to}/`) > -1));

  const handleSidebarMenuClose = () => {
    if (attrMobile && navClasses && navClasses['mobile-side-in']) {
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
      }, 230);
    }
  };

  const handleNavigationClick = (e) => {
    if (attrMobile) {
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