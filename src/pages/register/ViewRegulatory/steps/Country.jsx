import styles from "./Country.module.css";
import { useEffect, useState } from "react";
import { useRegulatoryFlow } from "../../../../../core/presentation/hooks";
import { countrySchema } from "../../../../schemas";
import { FormBuilder } from "@compratodo/ui-components";
import { Search } from "../../../../icons";
import { COUNTRIES } from '../../../../../core/constants/COUNTRIES';

const Country = () => {
    const {
        regulatory,
        setCountry,
        loading,
        setLoading
    } = useRegulatoryFlow();
    const [error, setError] = useState();
    const [schema, setSchema] = useState(() => ({ ...countrySchema }));

    useEffect(() => {
        setSchema(prev => ({
            ...prev,
            country: {
                ...prev.country,
                value: regulatory.country
            }
        }))
    }, [regulatory])

    const handleSubmit = async ({ country }) => {
        setLoading(true);
        const errorMsg = await setCountry(country);
        if(errorMsg){
            setError(errorMsg);
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

                {error && <span className="text-[var(--color-danger)]">* {error}</span>}

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

export default Country;