import styles from "./RegisterTerms.module.css";
import { useState, useEffect, useCallback } from "react";
import { Button, Card } from "@compratodo/ui-components";
import { TermItem } from "./TermItem";
import { useRegisterTerms } from "../../../hooks/useRegisterTerms";
import { checkboxTerms } from "../../../schemas/index";
import { useNavigate } from "react-router-dom";
import { useRegisterFlow } from "../../../hooks/useRegisterFlow";

const RegisterTerms: React.FC = () => {
    const navigate = useNavigate();
    const { acceptTerms } = useRegisterTerms();
    const { getTA } = useRegisterFlow();

    /**
     * Si no hay typeAccount en localStorage, redirige al inicio del registro.
     * Se ejecuta solo una vez al montar (steps no es necesario aquí,
     * salvo que lo uses para otras validaciones dinámicas).
     */
    useEffect(() => {
        localStorage.removeItem('e');
    }, [navigate,getTA]);

    // Estado de checkboxes y modal abierto
    const [checkedItems, setCheckedItems] = useState<boolean[]>(
        () => Array(checkboxTerms.length).fill(false)
    );
    const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);

    const handleCheckboxChange = useCallback((index: number) => {
        setCheckedItems(prev => {
            const updated = [...prev];
            updated[index] = !updated[index];
            return updated;
        });
    }, []);

    const allChecked = checkedItems.every(Boolean);

    /**
     * Construye el objeto { privacy: true, data: true, ... }
     * basado en los checkboxes seleccionados
     */
    const buildAcceptedObject = useCallback((): Record<string, boolean> => {
        const accepted: Record<string, boolean> = {};
        checkboxTerms.forEach((term, i) => {
            accepted[term.id] = checkedItems[i];
        });
        return accepted;
    }, [checkedItems]);

    const handleContinue = useCallback(() => {
        if (!allChecked) return;
        acceptTerms(buildAcceptedObject());
    }, [allChecked, acceptTerms, buildAcceptedObject]);

    return (
        <div className="text-center">
            <div className="flex justify-center mb-4">
                <div className="info">
                    <h1>¡Bienvenido! Te invitamos a revisar nuestras políticas de uso</h1>
                    <p className={styles.p}>
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
