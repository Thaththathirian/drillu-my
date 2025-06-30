import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from 'store/slices/dashboardSlice';

export const useDashboardData = () => {
  const dispatch = useDispatch();
  const { data: dashboardData, status } = useSelector((state) => state.dashboard);

  useEffect(() => {
    // Fetch dashboard data if not available
    if (!dashboardData && status === 'idle') {
      dispatch(fetchDashboardData());
    }
  }, [dashboardData, status, dispatch]);

  return dashboardData;
};