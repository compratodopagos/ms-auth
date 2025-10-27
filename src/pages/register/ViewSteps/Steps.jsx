import styles from "./Steps.module.css";

import React from "react";

import { Card, Preloader } from "@compratodo/ui-components";

import { useRegisterFlow } from "@core/presentation/hooks";
import CardStep from "../../../components/steps/CardStep";

const Steps = () => {
    const { steps } = useRegisterFlow(true);

    return (
        <div className={`${styles.container} ${styles.steps} text-center`}>
            <div className="flex justify-center mb-4">
                <div className={`${styles.info}`}>
                    <h1>Configura y Protege Tu Cuenta</h1>
                    <p>Sigue estos pasos para asegurar y personalizar el acceso a tu cuenta:</p>
                </div>
            </div>

            <Card title="" className={`${styles.card}`}>
                {
                    !steps.length ?
                        <Preloader />
                        :
                        steps.map((step, idx) => (
                            <CardStep steps={steps} step={step} key={idx} idx={idx} />
                        ))
                }
            </Card>
        </div>
    );
};

export default Steps;
