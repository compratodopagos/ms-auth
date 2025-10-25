import { lazy } from "react";
import { Navigate } from "react-router-dom";

const Login = lazy(() => import("./Login"))

const loginRoutes = [
  {
    path: "",
    element: (<Login />)
  },
  {
    path: "*",
    element: <Navigate to="/register" replace />,
  },
];

export default loginRoutes;