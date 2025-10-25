import { Navigate } from "react-router-dom";
import loginRoutes from "../pages/login/login.router";
import registerRoutes from "../pages/register/register.router";

export const routes = [
  {
    path: "/login",
    children: loginRoutes
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