export interface User {
  id: string;
  email: string;
  name: string;
  access_token: string;
  refresh_token: string;
  message?:string;
}