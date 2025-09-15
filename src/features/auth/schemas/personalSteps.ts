import { RegisterStep } from "../../../entities/types/RegisterStep";

export const personalSteps: RegisterStep[] = [
  { id: "email", title: "Proporciona tu correo electrónico", description: "Te enviaremos información importante sobre tu cuenta", completed: false },
  { id: "phone", title: "Verifica tu número de celular", description: "Será útil para recuperar tu cuenta si la olvidas", completed: false },
  { id: "identity", title: "Confirma tu identidad", description: "Verifica tu identidad subiendo un documento válido", completed: false },
  { id: "regulatory", title: "Completa los datos regulatorios", description: "Cumple con las normas vigentes en Colombia", completed: false },
  { id: "password", title: "Establece una contraseña segura", description: "Protege tu cuenta con credenciales seguras", completed: false },
];