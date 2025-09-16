import { lazy, Suspense } from "react";
import { Navigate, RouteObject } from "react-router-dom";

const LoginPage = lazy(() => import("../../features/auth/pages/Login/Login"));
const RegisterPage = lazy(() => import("../../features/auth/pages/Register/Register"));

export const routes: RouteObject[] = [
  {
    path: "/login",
    element: (
      <LoginPage />
    ),
  },
  {
    path: "/register",
    element: (
      <RegisterPage />
    ),
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
];