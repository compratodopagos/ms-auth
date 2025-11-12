import { RegisterStep } from "./RegisterStep";

export const companySteps: RegisterStep[] = [
  {
    id: "email",
    title: "Proporciona tu correo electrónico",
    description: "Te enviaremos información importante sobre tu cuenta",
    path: '/register/steps/email',
    completed: false
  },
  {
    id: "password",
    title: "Establece una contraseña segura",
    description: "Protege tu cuenta con credenciales seguras",
    path: '/register/steps/password',
    completed: false
  },
  {
    id: "phone",
    title: "Verifica tu número de celular",
    description: "Será útil para recuperar tu cuenta si la olvidas",
    path: '/register/steps/phone',
    completed: false
  },
  {
    id: "identity",
    title: "Confirma tu identidad",
    description: "Verifica tu identidad subiendo un documento válido",
    path: '/register/steps/identity',
    completed: false
  },
  {
    id: "company",
    title: "Completa los datos de tu empresa",
    description: "Te pediremos subir algunos documentos y tu cédula.",
    path: '/register/steps/company',
    completed: false
  }
];