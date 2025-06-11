import { DEFAULT_PATHS } from "config.js";
import Dashboard from "views/default/Dashboard";
import Courses from "views/default/Courses";
import CourseModules from "views/default/CourseModules";
import Tests from "views/default/Tests";
import StartTest from "views/default/StartTest";
import TestResults from "views/default/TestResults";
import Labs from "views/default/Labs";
import Placements from "views/default/Placements";
import Login from "views/default/Login";
import NotFound from "views/default/NotFound"; // Import NotFound component

const appRoot = DEFAULT_PATHS.APP.endsWith("/")
  ? DEFAULT_PATHS.APP.slice(1, DEFAULT_PATHS.APP.length)
  : DEFAULT_PATHS.APP;

let collegeId = null;
if (window.location.pathname.split("/")[1]) {
  // eslint-disable-next-line prefer-destructuring
  collegeId = window.location.pathname.split("/")[1];
  sessionStorage.setItem("collegeId", collegeId);
} else {
  collegeId = sessionStorage.getItem("collegeId");
}

const replaceCollegeIdInPath = (path) => {
  return path.replace(":collegeId", collegeId);
};

const routesAndMenuItems = {
  mainMenuItems: [
    {
      path: "/:collegeId",
      exact: true,
      redirect: true,
      to: replaceCollegeIdInPath("/:collegeId/dashboard"),
    },
    {
      path: "/:collegeId/dashboard",
      label: "Dashboard",
      icon: "home",
      component: Dashboard,
      to: replaceCollegeIdInPath("/:collegeId/dashboard"),
    },
    {
      path: "/:collegeId/courses",
      label: "Courses",
      icon: "book",
      component: Courses,
      to: replaceCollegeIdInPath("/:collegeId/courses"),
    },
    {
      path: "/:collegeId/tests/:courseId/:moduleId",
      component: Tests,
      to: replaceCollegeIdInPath("/:collegeId/tests/:courseId/:moduleId"),
    },
    {
      path: "/:collegeId/tests/:courseId/:testId/:moduleId/start",
      component: StartTest,
      to: replaceCollegeIdInPath("/:collegeId/tests/:courseId/:testId/:moduleId/start"),
    },
    {
      path: "/:collegeId/tests/:courseId/:testId/:moduleId/results",
      component: TestResults,
      to: replaceCollegeIdInPath("/:collegeId/tests/:courseId/:testId/:moduleId/results"),
    },
  ],
  sidebarItems: [],
  // Define public routes that don't require authentication
  publicRoutes: [
    {
      path: "/:collegeId/login",
      component: Login,
      to: replaceCollegeIdInPath("/:collegeId/login"),
    },
    {
      path: "/404",
      component: NotFound,
      to: "/404",
    },
    {
      path: "/:collegeId/404",
      component: NotFound,
      to: replaceCollegeIdInPath("/:collegeId/404"),
    },
  ],
  // Define all available routes for proper routing
  availableRoutes: [
    {
      path: "/:collegeId/dashboard",
      component: Dashboard,
      exact: true,
      to: replaceCollegeIdInPath("/:collegeId/dashboard"),
    },
    {
      path: "/:collegeId/courses",
      component: Courses,
      exact: true,
      to: replaceCollegeIdInPath("/:collegeId/courses"),
    },
    {
      path: "/:collegeId/labs",
      component: Labs,
      exact: true,
      to: replaceCollegeIdInPath("/:collegeId/labs"),
    },
    {
      path: "/:collegeId/placements",
      component: Placements,
      exact: true,
      to: replaceCollegeIdInPath("/:collegeId/placements"),
    },
    {
      path: "/:collegeId/course_modules/:courseId",
      component: CourseModules,
      exact: true,
      to: replaceCollegeIdInPath("/:collegeId/course_modules/:courseId"),
    },
    // IMPORTANT: Order matters - more specific routes first
    {
      path: "/:collegeId/tests/:courseId/:testId/:moduleId/results",
      component: TestResults,
      exact: true,
      to: replaceCollegeIdInPath("/:collegeId/tests/:courseId/:testId/:moduleId/results"),
    },
    {
      path: "/:collegeId/tests/:courseId/:testId/:moduleId/start",
      component: StartTest,
      exact: true,
      to: replaceCollegeIdInPath("/:collegeId/tests/:courseId/:testId/:moduleId/start"),
    },
    {
      path: "/:collegeId/tests/:courseId/:moduleId",
      component: Tests,
      exact: true,
      to: replaceCollegeIdInPath("/:collegeId/tests/:courseId/:moduleId"),
    },
    // 404 routes
    {
      path: "/:collegeId/404",
      component: NotFound,
      exact: true,
      to: replaceCollegeIdInPath("/:collegeId/404"),
    },
    {
      path: "/404",
      component: NotFound,
      exact: true,
      to: "/404",
    },
  ],
};

export default routesAndMenuItems;