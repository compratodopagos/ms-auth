export interface User {
  id: string;
  email: string;
  phone?: string;
  documentId?: string;
  accountType: "personal" | "business";
}