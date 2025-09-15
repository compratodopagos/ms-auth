import { RegisterStep } from "../../../entities/types/RegisterStep";

export const companySteps: RegisterStep[] = [
  { id: "email", title: "Proporciona tu correo electrónico", description: "Te enviaremos información importante sobre tu cuenta", completed: false },
  { id: "phone", title: "Verifica tu número de celular", description: "Será útil para recuperar tu cuenta si la olvidas", completed: false },
  { id: "companyData", title: "Completa los datos de tu empresa", description: "Te solicitaremos datos legales y tributarios", completed: false },
  { id: "password", title: "Establece una contraseña segura", description: "Protege tu cuenta con credenciales seguras", completed: false },
];