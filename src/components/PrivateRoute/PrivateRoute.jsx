import React from "react";
import AuthLayout from "../layout/AuthLayout";
import BasicLayout from "../layout/BasicLayout";
import ErrorPage from "../ErrorPage/ErrorPage";

const PrivateRoute = ({ isPrivate, children, ...rest }) => {
  const Layout = isPrivate ? AuthLayout : BasicLayout;

  const token = localStorage.getItem("jwt-token");

  return isPrivate ? (
    token ? (
      <Layout>{children}</Layout>
    ) : (
      <ErrorPage
        error={"403"}
        errorMessage={"Sorry, you are not authorized to access this page."}
      />
    )
  ) : (
    <Layout>{children}</Layout>
  );
};

export default PrivateRoute;