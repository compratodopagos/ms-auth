import { logout } from "../resources/logout";
import { login } from "./actions/login";

export const routes: Record<string, (event: any, pool: any) => Promise<any>> = {
    "POST:/login": login,
    "POST:/login/logout": logout,
};