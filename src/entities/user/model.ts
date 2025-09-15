export interface User {
  id: string;
  email: string;
  name: string;
  token: string; // JWT o session token
}