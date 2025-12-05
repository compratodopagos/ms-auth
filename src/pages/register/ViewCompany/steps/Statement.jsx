import { Button, Preloader } from '@compratodo/ui-components'
import { useState } from 'react';

export const Statement = ({ regulatoryFlow }) => {

    const { regulatory, setError, setStatement } = regulatoryFlow;
    const { completed } = regulatory.find(r => r.id === "statement") || {};

    const OPTIONS = [
        { label: 'Sí', value: 1 },
        { label: 'No', value: 0 }
    ];

    const [loading, setLoading] = useState(false);
    const [isPep, setIsPep] = useState(completed?.PEP === 1 || false);
    const [checkedIncome, setCheckedIncome] = useState(completed?.income_statement || false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const income_statement = formData.get('income_statement') === 'on'; // checkbox
        const PEP = Number(formData.get('PEP')); // radio
        const pep_position = formData.get('pep_position') || null;
        const pep_entity = formData.get('pep_entity') || null;
        const pep_relationship = formData.get('pep_relationship') || null;

        const payload = {
            income_statement,
            PEP,
            pep_position,
            pep_entity,
            pep_relationship
        };

        setLoading(true);
        const errorMsg = await setStatement(payload);
        setLoading(false);

        if (errorMsg) {
            setError(errorMsg);
        }
    };

    return (
        <div className="flex justify-center">
            <form className="text-left w-full max-w-[600px]" onSubmit={handleSubmit}>
                
                {/* Declaración de ingresos */}
                <div className="mb-6">
                    <label className="text-md font-medium block mb-2">
                        Declaración de ingresos
                    </label>
                    <div className="flex gap-4 items-start">
                        <label htmlFor="income_statement" className="text-justify text-sm flex-1">
                            Declaro, bajo mi responsabilidad, que la totalidad de los ingresos que percibo son de origen legal y están vinculados directamente con mi ocupación, profesión o actividad económica principal. Aseguro que estos ingresos no provienen de actividades ilícitas y que cumplo con las normativas legales aplicables según las disposiciones vigentes en mi país.
                        </label>
                        <input
                            id="income_statement"
                            name="income_statement"
                            type="checkbox"
                            className="w-6 h-6 accent-(--color-primary) mt-1"
                            checked={checkedIncome}
                            onChange={() => setCheckedIncome(!checkedIncome)}
                            required
                        />
                    </div>
                </div>

                {/* Pregunta PEP */}
                <div className="mb-8">
                    <label className="text-md font-medium">
                        ¿Eres considerado una Persona Expuesta Políticamente (PEP)?
                    </label>
                    <p className="max-w-[400px] text-justify mt-3 text-sm text-gray-700">
                        Se considera PEP a quien ocupó un cargo público importante en los últimos 2 años o es familiar de alguien que lo hizo.
                    </p>

                    <div className="mt-4">
                        {OPTIONS.map((opt) => (
                            <div
                                key={opt.value}
                                className="grid grid-cols-[1fr_auto] border-b border-[#E0E0E0] p-3"
                            >
                                <label htmlFor={`pep_${opt.value}`} className="text-sm">
                                    {opt.label}
                                </label>
                                <input
                                    id={`pep_${opt.value}`}
                                    name="PEP"
                                    type="radio"
                                    value={opt.value}
                                    checked={Number(completed?.PEP) === opt.value || isPep === (opt.value === 1)}
                                    onChange={() => setIsPep(opt.value === 1)}
                                    className="w-5 h-5 accent-(--color-primary)"
                                    required
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Campos condicionales si es PEP */}
                {isPep && (
                    <div className="mb-8 space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-800">
                            Por favor, proporciona la siguiente información:
                        </p>
                        <label className="block">
                            <span className="text-sm font-medium">Cargo o función pública desempeñada</span>
                            <input
                                type="text"
                                name="pep_position"
                                defaultValue={completed?.pep_position || ''}
                                className="border rounded-md p-2 w-full mt-1 text-sm"
                                placeholder="Ej: Senador, Asesor en Alcaldía, etc."
                                required
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium">Entidad o institución</span>
                            <input
                                type="text"
                                name="pep_entity"
                                defaultValue={completed?.pep_entity || ''}
                                className="border rounded-md p-2 w-full mt-1 text-sm"
                                placeholder="Ej: Congreso de la República, Alcaldía de Bogotá, etc."
                                required
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium">Relación o parentesco (si aplica)</span>
                            <input
                                type="text"
                                name="pep_relationship"
                                defaultValue={completed?.pep_relationship || ''}
                                className="border rounded-md p-2 w-full mt-1 text-sm"
                                placeholder="Ej: Cónyuge de un diputado, hijo de un alcalde, etc."
                            />
                        </label>
                    </div>
                )}

                {/* Botón enviar */}
                <div className="flex justify-end">
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? <Preloader /> : 'Continuar'}
                    </Button>
                </div>
            </form>
        </div>
    );
};