import { RegisterTypeAccount } from "./RegisterTypeAccount";
import RegisterTerms from "./RegisterTerms";
import { useTermsValidation } from "../hooks/useTermsValidation";
import RegisterSteps from "./RegisterSteps";

export const MainRegister = () => {
    const { showTerms, steps } = useTermsValidation();
    return (
        <>
            {steps.length == 0 ? <RegisterTypeAccount /> : (showTerms() ? <RegisterTerms /> : <RegisterSteps />)}
        </>
    );
};