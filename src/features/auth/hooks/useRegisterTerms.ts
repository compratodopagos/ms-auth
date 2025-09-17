import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTerms } from "../store/registerSlice";
import { Terms } from "../../../entities/types";
import { useNavigate } from "react-router-dom";

/**
 * Hook para manejar los términos de registro del usuario.
 *
 * - Lee/escribe en localStorage (usa base64 para evitar problemas con caracteres).
 * - Tiene fallback para formatos antiguos (JSON sin base64).
 * - Maneja errores y limpia localStorage si el contenido está corrupto.
 * - Memoiza funciones con useCallback y respeta dependencias en useEffect.
 */
export function useRegisterTerms() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    /**
     * Intenta parsear el contenido de localStorage:
     *  - primero asume base64(JSON)
     *  - si falla, intenta JSON plano (compatibilidad hacia atrás)
     *  - si todo falla, borra la clave y retorna null
     */
    const getStoredTerms = useCallback((): Terms | null => {
        if (typeof window === "undefined") return null;
        const raw = localStorage.getItem("terms");
        if (!raw) return null;

        // Intentar base64 -> JSON
        try {
            const decoded = atob(raw);
            return JSON.parse(decoded) as Terms;
        } catch (_) {
            // Intentar JSON plano
            try {
                return JSON.parse(raw) as Terms;
            } catch (__) {
                // Corrupto: eliminar y retornar null
                localStorage.removeItem("terms");
                return null;
            }
        }
    }, []);

    /**
     * Guarda los terms en localStorage (base64(JSON)) y actualiza store
     */
    const saveTerms = useCallback(
        (termsObj: Terms) => {
            if (typeof window === "undefined") return;
            try {
                const payload = btoa(JSON.stringify(termsObj));
                localStorage.setItem("terms", payload);
                dispatch(setTerms(termsObj));
            } catch (error) {
                console.error("Error guardando terms en localStorage:", error);
            }
        },
        [dispatch]
    );

    /**
     * Refresca el store con lo guardado en localStorage (si existe)
     */
    const refreshSteps = useCallback(() => {
        const stored = getStoredTerms();
        if (stored) {
            dispatch(setTerms(stored));
        }
    }, [dispatch, getStoredTerms]);

    useEffect(() => {
        refreshSteps();
    }, [refreshSteps]);

    /**
     * Marca términos como aceptados (recibe objeto { privacy: true, data: true, ... })
     * Agrega acceptedAt (ISO) y guarda + dispatch
     */
    const acceptTerms = useCallback(
        (terms: Record<string, boolean>) => {
            // Cargar estado actual (si existe)
            const current = getStoredTerms() ?? ({} as Terms);

            // Actualizar timestamps para claves aceptadas
            Object.entries(terms).forEach(([key, accepted]) => {
                if (accepted) {
                    current[key] = {
                        ...current[key],
                        acceptedAt: new Date().toISOString(),
                    };
                }
            });

            // Guardar y enviar al store
            saveTerms(current);
            // Navegar al siguiente paso (si aplica)
            try {
                navigate("/register/steps");
            } catch (err) {
                // No interrumpir por un error de navegación
                console.warn("navigate fallo en acceptTerms:", err);
            }
        },
        [getStoredTerms, navigate, saveTerms]
    );

    return {
        refreshSteps,
        acceptTerms,
        getStoredTerms, // util para consumir desde componentes si lo necesita
    };
}