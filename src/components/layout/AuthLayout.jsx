import React from "react";
import Nav from "../nav/Nav";

const AuthLayout = ({ children }) => {
  return (
    <>
      <Nav content={children} />
    </>
  );
};

export default AuthLayout;
