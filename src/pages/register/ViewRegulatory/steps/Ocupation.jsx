import styles from "./Country.module.css";
import { useEffect, useState } from "react";
import { ocupationSchema } from "../../../../schemas";
import { Search } from "../../../../icons";
import { FormBuilder } from "@compratodo/ui-components";

const OCUPATIONS = [
    'Trabajo con salario fijo',
    'Independiente',
    'Soy estudiante',
    'Estoy pensionado/a',
    'Vivo de ingresos por capital',
    'Ama/o de casa',
    'Actualmente no tengo empleo'
];

export const Ocupation = ({
    regulatoryFlow
}) => {
    const {
        error,
        setError,
        regulatory,
        setOcupation,
        loading,
        setLoading
    } = regulatoryFlow;

    const [schema, setSchema] = useState(() => ({ ...ocupationSchema }));

    useEffect(() => {
        const value = regulatory.find(r => r.id == 'ocupation')?.completed;
        setSchema(prev => ({
            ...prev,
            ocupation: {
                ...prev.ocupation,
                value,
                options: OCUPATIONS.map(ocupation => ({
                    value: ocupation,
                    label: ocupation
                }))
            }
        }));
    }, [regulatory])

    const handleSubmit = async ({ ocupation }) => {
        setLoading(true);
        const errorMsg = await setOcupation(ocupation);
        if (errorMsg) {
            setError(errorMsg);
            return;
        }
    };

    const search = ({ target }) => {
        const { value } = target;
        const newOptions = value.length > 0
            ? OCUPATIONS.filter(c =>
                c.toLowerCase().includes(value.toLowerCase())
            )
            : OCUPATIONS;

        setSchema(prev => ({
            ...prev,
            ocupation: {
                ...prev.country,
                options: newOptions.map(ocupation => ({
                    value: ocupation,
                    label: ocupation
                }))
            }
        }));
    };

    return (
        <div className={`flex justify-center ${styles.container}`}>
            <div className={styles.containerForm}>
                <div className="flex justify-center">
                    <div className={`flex ${styles.search}`}>
                        <Search className="w-6 me-2" />
                        <input
                            type="text"
                            name="search"
                            className={`${styles.inputSearch} w-full`}
                            onChange={search}
                        />
                    </div>
                </div>

                {error && <span className="text-(--color-danger)">* {error}</span>}
                <div className="form text-left mt-6">
                    <FormBuilder
                        schema={schema}
                        onSubmit={handleSubmit}
                        submitButtonProps={{
                            type: "submit",
                            variant: "primary",
                            disabled: loading
                        }}
                        submitButtonText="Continuar"
                        className="space-y-4 text-left"
                        inputClassContainer={styles.inputClassContainer}
                    />
                </div>
            </div>
        </div>
    );
};