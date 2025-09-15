import { lazy, Suspense } from "react";
import { Navigate, RouteObject } from "react-router-dom";

const LoginPage = lazy(() => import("../../features/auth/pages/Login/Login"));
const RegisterPage = lazy(() => import("../../features/auth/pages/Register/Register"));

export const routes: RouteObject[] = [
  {
    path: "/login",
    element: (
      <Suspense fallback={<div>Cargando...</div>}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={<div>Cargando...</div>}>
        <RegisterPage />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
];