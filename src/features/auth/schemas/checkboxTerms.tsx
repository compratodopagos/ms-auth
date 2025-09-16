import TermModal from '../components/TermModal';

export const checkboxTerms = [
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