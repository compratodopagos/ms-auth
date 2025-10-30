import { RegisterStep } from "./RegisterStep";

export const regulatorySteps: RegisterStep[] = [
  
  {
    id: "country",
    title: "País",
    description: "¿Cuál es tu país de residencia?",
    path: '/register/regulatory',
    completed: false
  },
  {
    id: "residence",
    title: "Residencia",
    description: "¿Cuál es tu lugar de residencia?",
    path: '/register/regulatory/residence',
    completed: false
  },
  {
    id: "ocupation",
    title: "Ocupación",
    description: "¿A qué te dedicas?",
    path: '/register/regulatory/phone',
    completed: false
  },
  {
    id: "statement",
    title: "Declaración",
    description: "Declaración de ingresos",
    path: '/register/regulatory/identity',
    completed: false
  },
  {
    id: "terms",
    title: "Términos",
    description: "Para continuar, debes aceptar los Términos y Condiciones",
    path: '/register/regulatory/regulatory',
    completed: false
  }
];