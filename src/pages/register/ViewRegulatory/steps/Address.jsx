import { FormBuilder } from "@compratodo/ui-components";
import { addressSchema } from "../../../../schemas";
import { useState } from "react";
import { useRegulatoryFlow } from "../../../../../core/presentation/hooks";

const Address = () => {
    const {
        loading
    } = useRegulatoryFlow();
    const [error, setError] = useState();

    const handleSubmit = async ({ department }) => {
        console.log(department)
        /*
        setLoading(true);
        const errorMsg = await setEmail(email);
        if(errorMsg){
            setError(errorMsg);
        }
            */
    }

    return (
        <>
            {error ? <span className='text-[var(--color-danger)]'>* {error}</span> : null}
            <div className="text-left mt-6">
                <FormBuilder
                    schema={addressSchema}
                    onSubmit={handleSubmit}
                    submitButtonProps={{ type: 'submit', variant: 'primary', disabled: loading }}
                    submitButtonText={'Continuar'}
                    className="space-y-4 text-left">
                    <p className='mb-3'>Formato sugerido: nombre@ejemplo.com</p>
                </FormBuilder>
            </div>
        </>
    );
}

export default Address;