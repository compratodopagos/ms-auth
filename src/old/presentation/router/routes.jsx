import { Navigate } from "react-router-dom";

import loginRoutes from '../pages/login/Login.router';

export const routes = [
  {
    path: "/login",
    children: loginRoutes
  },
  // {
  //   path: "/register",
  //   children: registerRoutes
  // },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
];