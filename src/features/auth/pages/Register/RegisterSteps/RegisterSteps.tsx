import React from "react";
import "./RegisterSteps.css";
import { Card } from "@compratodo/ui-components";
import { useRegisterFlow } from "../../../hooks/useRegisterFlow";
import { CardStep } from "../../../components/steps/CardStep";
import { Step } from "../../../../../entities/types";

const RegisterSteps: React.FC = () => {
    const { steps = [] } = useRegisterFlow(); // defensivo: default a array vacío

    // Si no hay steps, renderiza un placeholder (mejor UX que romper)
    if (!steps.length) {
        return (
            <div className="container steps text-center">
                <div className="flex justify-center mb-4">
                    <div className="info">
                        <h1>Configura y Protege Tu Cuenta</h1>
                        <p>Sigue estos pasos para asegurar y personalizar el acceso a tu cuenta:</p>
                    </div>
                </div>

                <Card title="">
                    <p>No se han definido pasos de registro.</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="container steps text-center">
            <div className="flex justify-center mb-4">
                <div className="info">
                    <h1>Configura y Protege Tu Cuenta</h1>
                    <p>Sigue estos pasos para asegurar y personalizar el acceso a tu cuenta:</p>
                </div>
            </div>

            <Card title="">
                {steps.map((step: Step, idx: number) => (
                    <CardStep steps={steps} step={step} key={idx} idx={idx}/>
                ))}
            </Card>
        </div>
    );
};

export default RegisterSteps;
