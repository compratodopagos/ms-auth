import styles from './NitStep.module.css';
import { useState } from "react";
import { useRegisterFlow } from "../../../../../../core/presentation/hooks";
import { Card, FormBuilder } from "@compratodo/ui-components";
import { nitSchema } from '../../../../../schemas'; // ✅ usa el schema correcto (con validateNit)

const NitStep = () => {
    const { setNit } = useRegisterFlow();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async ({ nit }) => {
        setLoading(true);
        setError(null);

        // Llamada al flujo
        const errorMsg = await setNit(nit);
        if (errorMsg) {
            setError(errorMsg);
        }

        setLoading(false);
    };

    return (
        <Card
            title=""
            className={`${styles.card} container flex justify-center items-center`}
        >
            <div className={`${styles.info} text-center`}>
                <h2>Ingresa el NIT de tu empresa</h2>
                <p>Escribe el NIT completo, incluyendo el dígito de verificación.</p>

                {error && (
                    <span className="text-(--color-danger) block mt-2">
                        * {error}
                    </span>
                )}

                <div className="text-left mt-6">
                    <FormBuilder
                        schema={nitSchema}
                        onSubmit={handleSubmit}
                        submitButtonProps={{
                            type: 'submit',
                            variant: 'primary',
                            disabled: loading
                        }}
                        submitButtonText={loading ? 'Validando...' : 'Continuar'}
                        className="space-y-4 text-left"
                    />
                </div>
            </div>
        </Card>
    );
};

export default NitStep;