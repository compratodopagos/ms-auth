import styles from "./Country.module.css";
import { useEffect, useState } from "react";
import { countrySchema } from "../../../../schemas";
import { Search } from "../../../../icons";
import { COUNTRIES } from '../../../../../core/constants/COUNTRIES';
import { FormBuilder } from "@compratodo/ui-components";

export const Country = ({
    regulatoryFlow
}) => {
    const {
        error,
        setError,
        regulatory,
        setCountry,
        loading,
        setLoading
    } = regulatoryFlow;

    const [schema, setSchema] = useState(() => ({ ...countrySchema }));

    useEffect(() => {
        const value = regulatory.find(r => r.id == 'country')?.completed;
        setSchema(prev => ({
            ...prev,
            country: {
                ...prev.country,
                value
            }
        }));
    }, [regulatory])

    const handleSubmit = async ({ country }) => {
        setLoading(true);
        const errorMsg = await setCountry(country);
        if (errorMsg) {
            setError(errorMsg);
            return;
        }
        
    };

    const search = ({ target }) => {
        const { value } = target;
        const newCountries = value.length > 0
            ? COUNTRIES.filter(c =>
                c.name.toLowerCase().includes(value.toLowerCase())
            )
            : COUNTRIES;

        setSchema(prev => ({
            ...prev,
            country: {
                ...prev.country,
                options: newCountries.map(c => ({
                    value: c.name,
                    label: c.name
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