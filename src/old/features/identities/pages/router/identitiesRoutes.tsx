import { lazy } from "react";
import { Navigate, RouteObject } from "react-router-dom";

export const identitiesRoutes: RouteObject[] = [
  {
    path: "",
    element: (<h1>asd</h1>)
  },
  {
    path: "*",
    element: <Navigate to="/register" replace />,
  },
];