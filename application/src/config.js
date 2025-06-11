import {
  LAYOUT,
  MENU_BEHAVIOUR,
  NAV_COLOR,
  MENU_PLACEMENT,
  RADIUS,
  THEME_COLOR,
  USER_ROLE,
} from "constants.js";

export const IS_DEMO = false;
export const IS_AUTH_GUARD_ACTIVE = true;
export const SERVICE_URL = "/app";
export const USE_MULTI_LANGUAGE = true;
export const DYNAMIC_PATH = ":collegeId";
export const REACT_HELMET_PROPS = {
  defaultTitle: "Drillu Student Portal",
  titleTemplate: "%s | Drillu Student Portal",
};

export const DEFAULT_PATHS = {
  APP: "/",
  LOGIN: "/:collegeId/login",
  REGISTER: "/:collegeId/register",
  FORGOT_PASSWORD: "/:collegeId/forgot-password",
  RESET_PASSWORD: "/:collegeId/reset-password",
  USER_WELCOME: "/:collegeId/dashboards/default",
  NOTFOUND: "/:collegeId/page-not-found",
  UNAUTHORIZED: "/:collegeId/unauthorized",
  INVALID_ACCESS: "/:collegeId/invalid-access",
};

export const DEFAULT_SETTINGS = {
  MENU_PLACEMENT: MENU_PLACEMENT.Vertical,
  MENU_BEHAVIOUR: MENU_BEHAVIOUR.Unpinned,
  LAYOUT: LAYOUT.Boxed,
  RADIUS: RADIUS.Standard,
  COLOR: THEME_COLOR.LightGreen,
  NAV_COLOR: NAV_COLOR.Light,
  USE_SIDEBAR: false,
};

export const DEFAULT_USER = {
  id: 1,
  name: "Lisa Jackson",
  thumb: "/img/profile/profile-9.webp",
  role: USER_ROLE.Admin,
  email: "lisajackson@gmail.com",
};

export const REDUX_PERSIST_KEY = "starter-project";
