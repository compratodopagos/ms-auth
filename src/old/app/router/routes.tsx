import { Navigate, RouteObject } from "react-router-dom";

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