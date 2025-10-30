import { lazy } from "react";
import { Navigate } from "react-router-dom";


const Register = lazy(() => import("./Register"));
const StepTypeAccount = lazy(() => import("./TypeAccount/TypeAccount.jsx"));
const StepTerms = lazy(() => import("./Terms/Terms.jsx"));
const Steps = lazy(() => import("./ViewSteps/Steps.jsx"));

const Email = lazy(() => import("./ViewSteps/steps/Email/Email.jsx"));
const EmailValid = lazy(() => import("./ViewSteps/steps/Email/EmailValid.jsx"));

const PasswordStep = lazy(() => import("./ViewSteps/steps/PasswordStep/PasswordStep.jsx"));

const PhoneStep = lazy(() => import("./ViewSteps/steps/PhoneStep/PhoneStep.jsx"));
const PhoneValidStep = lazy(() => import("./ViewSteps/steps/PhoneStep/PhoneValidStep.jsx"));

const IdentityStep = lazy(() => import("./ViewSteps/steps/IdentityStep/IdentityStep.jsx"));
const ValidFaceStep = lazy(() => import("./ViewSteps/steps/IdentityStep/ValidFaceStep.jsx"));

const Regulatory = lazy(() => import("./ViewRegulatory/Regulatory.jsx"));
const Address = lazy(() => import("./ViewRegulatory/steps/Address.jsx"));
const Country = lazy(() => import("./ViewRegulatory/steps/Country.jsx"));

const registerRoutes = [
  {
    path: "",
    element: (<Register />),
    children: [
      {
        path: "",
        element: (<StepTypeAccount />)
      },
      {
        path: "terms",
        element: (<StepTerms />)
      },
      {
        path: "steps",
        children: [
          {
            path: "",
            element: (<Steps />)
          },
          {
            path: "email",
            children: [
              {
                path: "",
                element: (<Email />)
              },
              {
                path: "valid",
                element: (<EmailValid />)
              }
            ]
          },
          {
            path: "password",
            element: (<PasswordStep />)
          },
          {
            path: "phone",
            children: [
              {
                path: "",
                element: (<PhoneStep />)
              },
              {
                path: "valid",
                element: (<PhoneValidStep />)
              }
            ]
          },
          {
            path: "identity",
            children: [
              {
                path: "",
                element: (<IdentityStep />)
              },
              {
                path: "valid",
                element: (<ValidFaceStep />)
              }
            ]
          }
        ]
      },
      {
        path: "regulatory",
        element: (<Regulatory />),
        children: [
          {
            path: "",
            element: (<Country/>)
          },
          {
            path: "residence",
            element: (<Address/>)
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

export default registerRoutes;