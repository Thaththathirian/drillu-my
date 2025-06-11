import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, Route, useLocation, useParams } from "react-router-dom";
import { checkAuth } from "auth/authSlice";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { collegeId } = useParams();
  const { isLogin, loading } = useSelector((state) => state.auth);

  console.log("ProtectedRoute -location:", location);

  useEffect(() => {
    if (!isLogin) {
      dispatch(checkAuth());
    }
  }, [dispatch, isLogin]);

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log("ProtectedRoute -isLogin:", isLogin);

  if (!isLogin) {
    return (
      <Redirect
        to={{
          pathname: `/${collegeId}/login`,
          state: { from: location },
        }}
      />
    );
  }

  return <Route {...rest} component={Component} />;
};

export default ProtectedRoute;
