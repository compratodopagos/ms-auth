import { createTerms } from "./actions/createTerms";

export const routes: Record<string, (event: any, pool: any) => Promise<any>> = {
    "POST:/terms": createTerms
};