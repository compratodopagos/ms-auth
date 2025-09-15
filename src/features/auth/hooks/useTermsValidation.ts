import { useSelector } from "react-redux";
import { RootState } from "../../../entities/store";
import { TermData } from "../../../entities/types";

export function useTermsValidation() {

    const { steps, acceptDataManagement, acceptDataUser, acceptUserConditions } = useSelector((state: RootState) => state.register);

    const showTerms = () => {
        const terms = [acceptDataManagement, acceptDataUser, acceptUserConditions];
        return terms.some(term => termsExpired(term));
    }

    const termsExpired = (term?: TermData, hoursValid: number = 24): boolean => {
        if (!term) return true; // nunca aceptado => pedir de nuevo
        const { acceptedAt } = term;

        const now = Date.now();
        const expiration = acceptedAt + (hoursValid * 60 * 60 * 1000);

        return now > expiration; // si me pasé del tiempo, expiro
    }

    return { steps, showTerms };

}