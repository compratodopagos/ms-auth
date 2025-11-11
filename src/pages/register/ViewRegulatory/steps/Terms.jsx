import { Button, Preloader } from '@compratodo/ui-components'
import { useState } from 'react';

export const Terms = ({ regulatoryFlow }) => {

    const { regulatory, setError, setTerms } = regulatoryFlow;
    const { completed } = regulatory.find(r => r.id === "terms") || {};

    const [loading, setLoading] = useState(false);
    const [checkedTyc, setCheckedTyc] = useState(completed || false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const tyc = formData.get('tyc') === 'on';

        setLoading(true);
        const errorMsg = await setTerms(tyc);
        setLoading(false);

        if (errorMsg) {
            setError(errorMsg);
        }
    };

    return (
        <div className="flex justify-center">
            <form className="text-left w-full max-w-[450px] mt-5" onSubmit={handleSubmit}>

                <div>
                    <label className="text-md block mb-2">
                        Recuerda que podemos:
                    </label>
                    <ul className="list-disc ml-5">
                        <li className='text-primary'>Solicitarte información adicional de tu cuenta para cumplir con las leyes vigentes.</li>
                        <li className='text-primary'>Suspender o cerrar la cuenta si detectamos incumplimiento de nuestras políticas.</li>
                    </ul>
                </div>

                <div className="flex gap-4 items-start">
                    <input
                        id="tyc"
                        name="tyc"
                        type="checkbox"
                        className="w-5 h-5 accent-(--color-primary) mt-1"
                        checked={checkedTyc}
                        onChange={() => setCheckedTyc(!checkedTyc)}
                        required
                    />
                    <label htmlFor="tyc" className="text-justify text-xs flex-1">
                        Confirmo que he leído y acepto los Términos y Condiciones de Compratodo y autorizo el uso de mis datos conforme a la Declaración de Privacidad.
                    </label>
                </div>

                {/* Botón enviar */}
                <div className="flex mt-6">
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? <Preloader /> : 'Continuar'}
                    </Button>
                </div>
            </form>
        </div>
    );
};