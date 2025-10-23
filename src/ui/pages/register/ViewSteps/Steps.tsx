import "./Steps.css";

import React, { useEffect } from "react";

import { Card, Preloader } from "@compratodo/ui-components";

import { useRegisterFlow } from "../../../../presentation/hooks";
import CardStep from "../../../components/steps/CardStep";
import { Step } from "../../../../domain/types";

const Steps = () => {
    const { steps } = useRegisterFlow(true);

    return (
        <div className="container steps text-center">
            <div className="flex justify-center mb-4">
                <div className="info">
                    <h1>Configura y Protege Tu Cuenta</h1>
                    <p>Sigue estos pasos para asegurar y personalizar el acceso a tu cuenta:</p>
                </div>
            </div>

            <Card title="">
                {
                    !steps.length ?
                        <Preloader />
                        :
                        steps.map((step: Step, idx: number) => (
                            <CardStep steps={steps} step={step} key={idx} idx={idx} />
                        ))
                }
            </Card>
        </div>
    );
};

export default Steps;
