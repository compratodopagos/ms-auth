import { lazy, Suspense } from "react";
import { Navigate, RouteObject } from "react-router-dom";

const LoginPage = lazy(() => import("../../features/auth/pages/Login/Login"));

import { registerRoutes } from '../../features/auth/pages/Register/router/registerRoutes'

export const routes: RouteObject[] = [
  {
    path: "/login",
    element: (
      <LoginPage />
    ),
  },
  {
    path: "/register",
    children: registerRoutes
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
];