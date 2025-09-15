import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTerms } from "../store/registerSlice";
import { Terms } from "../../../entities/types";

/**
 * Hook para manejar los términos de registro del usuario
 */
export function useRegisterTerms() {
    const dispatch = useDispatch();

    useEffect(() => {
        refreshSteps();
    }, []);

    /**
     * Carga desde localStorage los términos y los envía al store
     */
    const refreshSteps = () => {
        const storedTerms = localStorage.getItem("terms");
        if (storedTerms) {
            // ✅ Se corrige la sintaxis de asignación
            try {
                const jsonTerms = JSON.parse(atob(storedTerms)) as Terms;
                dispatch(setTerms(jsonTerms));
            } catch (error) {
                localStorage.removeItem('terms');
            }
        }
    };

    /**
     * Marca los términos como aceptados y actualiza el store
     * @param terms Objeto con las claves de términos aceptados (por ejemplo { term1: true, term2: true })
     */
    const acceptTerms = (terms: Record<string, boolean>) => {
        let storedTerms = localStorage.getItem("terms");
        if(storedTerms){
            try {
                JSON.parse(storedTerms)
            } catch (error) {
                localStorage.removeItem('terms');
                storedTerms = null;
            }
        }
        let currentTerms: Terms = storedTerms ? JSON.parse(storedTerms) : {};

        // 🔑 Recorremos cada clave de terms y si está aceptada, registramos el timestamp
        Object.keys(terms).forEach((key) => {
            if (terms[key]) {
                currentTerms[key] = {
                    ...currentTerms[key],
                    acceptedAt: Date.now(), // o new Date().toISOString()
                };
            }
        });

        // Guardar en localStorage y enviar al store
        localStorage.setItem("terms", btoa(JSON.stringify(currentTerms)));
        dispatch(setTerms(currentTerms));
    };

    return {
        refreshSteps,
        acceptTerms,
    };
}
