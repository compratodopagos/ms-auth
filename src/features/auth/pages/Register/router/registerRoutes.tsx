import { lazy } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import RegisterEmailValidStep from "../RegisterEmailStep/RegisterEmailValidStep";
import RegisterPasswordStep from "../RegisterPasswordStep/RegisterPasswordStep";

const Register = lazy(() => import("../Register"));
const RegisterTypeAccount = lazy(() => import("../RegisterTypeAccount/RegisterTypeAccount"));
const RegisterTerms = lazy(() => import("../RegisterTerms/RegisterTerms"));
const RegisterSteps = lazy(() => import("../RegisterSteps/RegisterSteps"));
const RegisterEmailStep = lazy(() => import("../RegisterEmailStep/RegisterEmailStep"));

export const registerRoutes: RouteObject[] = [
  {
    path: "",
    element: (<Register />),
    children: [
      {
        path: "",
        element: (<RegisterTypeAccount />)
      },
      {
        path: "terms",
        element: (<RegisterTerms />)
      },
      {
        path: "steps",
        children: [
          {
            path: "",
            element: (<RegisterSteps />)
          },
          {
            path: "email",
            children: [
              {
                path: "",
                element: (<RegisterEmailStep />)
              },
              {
                path: "valid",
                element: (<RegisterEmailValidStep />)
              }
            ]
          },
          {
            path: "password",
            element: (<RegisterPasswordStep />)
          }
        ]
      }
    ]
  },
  {
    path: "*",
    element: <Navigate to="/register" replace />,
  },
];