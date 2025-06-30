import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseTypes } from 'store/slices/courseTypesSlice';

export const useDynamicNavigation = () => {
  const dispatch = useDispatch();
  const { courseTypes, status: courseTypesStatus } = useSelector((state) => state.courseTypes);
  const collegeId = sessionStorage.getItem("collegeId");

  useEffect(() => {
    if (collegeId && courseTypesStatus === 'idle') {
      dispatch(fetchCourseTypes(collegeId));
    }
  }, [dispatch, collegeId, courseTypesStatus]);

  const generateDynamicMenuItems = (baseMenuItems) => {
    if (courseTypesStatus !== 'succeeded' || !courseTypes.length) {
      return baseMenuItems;
    }

    return baseMenuItems.map(item => {
      // Add sub-navigation to courses menu item
      if (item.path && item.path.includes('/courses')) {
        const courseTypeSubs = courseTypes.map(courseType => ({
          path: `/${collegeId}/courses?course_type=${courseType.id}`,
          label: courseType.type,
          icon: "layers",
          to: `/${collegeId}/courses?course_type=${courseType.id}`,
        }));

        return {
          ...item,
          subs: [
            {
              path: `/${collegeId}/courses`,
              label: "All Courses", 
              icon: "book",
              to: `/${collegeId}/courses`,
            },
            ...courseTypeSubs
          ]
        };
      }
      return item;
    });
  };

  return {
    courseTypes,
    courseTypesStatus,
    generateDynamicMenuItems
  };
};
