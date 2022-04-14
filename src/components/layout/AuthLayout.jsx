import React from "react";
import Navbar from "../navbar/Navbar";

const AuthLayout = ({ children }) => {
  return (
    <>
      <Navbar content={children} />
    </>
  );
};

export default AuthLayout;
