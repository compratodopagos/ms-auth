import { RegisterTypeAccount } from "./RegisterTypeAccount";
import RegisterTerms from "./RegisterTerms";
import { useTermsValidation } from "../hooks/useTermsValidation";

export const MainRegister = () => {
    const { showTerms, steps } = useTermsValidation();
    return (
        <>
            {steps.length == 0 ? <RegisterTypeAccount /> : (showTerms() ? <RegisterTerms /> : "Steps")}
        </>
    );
};