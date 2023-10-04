import React from "react";
import { Outlet } from "react-router-dom";
import Header from '../UI/Header';
import { AuthProvider } from "../../context/AuthContext";

const RootLayout = () => {
  return (
    <AuthProvider>
      <Header />
      <Outlet />
    </AuthProvider>
  );
};

export default RootLayout;
