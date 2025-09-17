import { useCallback, useMemo } from "react";
import { Card, Button } from "@compratodo/ui-components";
import IconCardCircle from "../IconCardCircle";
import {
    MailPlus,
    Smartphone,
    ScanLine,
    KeyRound,
    Scale,
    PlusCircle
} from "lucide-react";
import { Step } from "../../../../entities/types";
import { useNavigate } from "react-router-dom";

const renderIcon = (param: string) => {
    switch (param) {
        case "email":
            return <MailPlus width={20} color="#07144E" />;
        case "phone":
            return <Smartphone width={20} color="#07144E" />;
        case "identity":
            return <ScanLine width={20} color="#07144E" />;
        case "regulatory":
            return <KeyRound width={20} color="#07144E" />;
        case "password":
            return <Scale width={20} color="#07144E" />;
        default:
            return null;
    }
};

export const CardStep = ({
    steps,
    step,
    idx
}) => {

    const navigate = useNavigate();

    /**
     * Pre-calcula el array de flags `isActive` para cada step con la misma lógica:
     * - primer paso activo si no está completado
     * - paso i activo si el anterior está completado y el actual NO está completado
     *
     * Esto evita calcular la misma condición dos veces (para variant y disabled).
     */
    const isActive = useMemo(() => {
        return steps.map((step, idx) => {
            const currentCompleted = Boolean(step?.completed);
            if (idx === 0) return !currentCompleted;
            const prevCompleted = Boolean(steps[idx - 1]?.completed);
            return prevCompleted && !currentCompleted;
        });
    }, [steps]);

    /**
     * Navega solo si el step está activo (misma lógica que antes).
     * useCallback para mantener la referencia estable.
     */
    const navigateStep = useCallback(
        (step: Step, idx: number) => {
            if (!isActive[idx]) return;
            navigate(step.path);
        },
        [isActive, navigate]
    );

    return (
        <Card title="" className="grid-2 step mb-2" key={step.id ?? idx}>
            <div className="flex">
                <IconCardCircle>{renderIcon(step.id)}</IconCardCircle>

                <div className="text-left">
                    <label>{step.title}</label>
                    <p>{step.description}</p>
                </div>
            </div>

            <div className="flex items-center justify-center">
                <Button
                    type="button"
                    size="xs"
                    variant={isActive[idx] ? "accent" : "light"}
                    disabled={!isActive[idx]}
                    aria-disabled={!isActive[idx]}
                    onClick={() => navigateStep(step, idx)}
                >
                    <div className="flex items-center justify-center m-0">
                        <b className="mr-1">Agregar</b>
                        <PlusCircle width={18} />
                    </div>
                </Button>
            </div>
        </Card>
    );
}