import { useState } from "react";
import "./RegisterTerms.css";
import { Button, Card } from "@compratodo/ui-components";
import { TermItem } from "./TermItem";
import { useRegisterTerms } from "../hooks/useRegisterTerms";
import TermModal from './TermModal';

const RegisterTerms = () => {
    // ✅ Usa un id único para cada término, no solo el label
    const checkboxTerms = [
        {
            id: "acceptDataUser",
            label:
                "Doy mi consentimiento para el uso de mis datos conforme a la declaración de privacidad",
            component: <TermModal />,
        },
        {
            id: "acceptDataManagement",
            label: "Apruebo el manejo de mis datos personales.",
            component: <TermModal />,
        },
        {
            id: "acceptUserConditions",
            label:
                "Estoy de acuerdo con los términos y condiciones generales de uso de compra todo.",
            component: <TermModal />,
        },
    ];

    const { acceptTerms } = useRegisterTerms();

    const [checkedItems, setCheckedItems] = useState<boolean[]>(
        Array(checkboxTerms.length).fill(false)
    );
    const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);

    const handleCheckboxChange = (index: number) => {
        const updated = [...checkedItems];
        updated[index] = !updated[index];
        setCheckedItems(updated);
    };

    const allChecked = checkedItems.every(Boolean);

    const handleContinue = () => {
        if (!allChecked) return;

        // ✅ Construir objeto { privacy: true, data: true, conditions: true }
        const accepted: Record<string, boolean> = {};
        checkboxTerms.forEach((term, i) => {
            accepted[term.id] = checkedItems[i];
        });

        // Guarda en localStorage + redux
        acceptTerms(accepted);
    };

    return (
        <div className="text-center">
            <div className="flex justify-center mb-4">
                <div className="info">
                    <h1>¡Bienvenido! Te invitamos a revisar nuestras políticas de uso</h1>
                    <p>
                        Selecciona el tipo de cuenta que mejor se adapte a tus necesidades.
                        Gestiona tus pagos de manera segura y eficiente.
                    </p>
                </div>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
                <Card title="">
                    {checkboxTerms.map((term, index) => (
                        <TermItem
                            key={term.id}
                            term={term}
                            checked={checkedItems[index]}
                            onToggle={() => handleCheckboxChange(index)}
                            onOpenModal={() =>
                                setOpenModalIndex(openModalIndex === index ? null : index)
                            }
                            isModalOpen={openModalIndex === index}
                        />
                    ))}

                    <div className="mt-4">
                        <Button
                            type="button"
                            onClick={handleContinue}
                            disabled={!allChecked}
                            variant={allChecked ? "primary" : "disabled"}
                        >
                            <b className="text-white">Continuar</b>
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    );
};

export default RegisterTerms;
