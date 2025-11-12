import TermModal from '../pages/register/Terms/TermModal';

export const checkboxTerms = [
    {
        id: "acceptDataUser",
        label: "Doy mi consentimiento para el uso de mis datos conforme a la declaración de privacidad",
        component: <TermModal
            title="Manejo de Datos Personales"
            description="Al dar tu consentimiento, autorizas el uso de tus datos conforme a nuestra declaración de privacidad. Esto implica que recopilamos, almacenamos y tratamos tu información personal con estrictos protocolos de seguridad para mejorar y personalizar tu experiencia en nuestra plataforma. Revisa en detalle cómo protegemos tus datos y cuáles son tus derechos en nuestro documento completo de privacidad."
        />,
    },
    {
        id: "acceptDataManagement",
        label: "Apruebo el manejo de mis datos personales.",
        component: <TermModal
            title="Términos y Condiciones Generales de Uso"
            description="Al aceptar los términos y condiciones generales de uso, te comprometes a seguir las directrices y reglas establecidas para la utilización de nuestra plataforma. Estos términos regulan tus derechos y obligaciones, definiendo el marco para una relación segura, transparente y responsable. Te recomendamos leer detenidamente este documento para conocer todas las condiciones y asegurar una experiencia satisfactoria."
        />,
    },
    {
        id: "acceptUserConditions",
        label: "Estoy de acuerdo con los términos y condiciones generales de uso de compra todo.",
        component: <TermModal
            title="Declaración de Privacidad"
            description="Al dar tu consentimiento, autorizas el uso de tus datos conforme a nuestra declaración de privacidad. Esto implica que recopilamos, almacenamos y tratamos tu información personal con estrictos protocolos de seguridad para mejorar y personalizar tu experiencia en nuestra plataforma. Revisa en detalle cómo protegemos tus datos y cuáles son tus derechos en nuestro documento completo de privacidad."
        />,
    },
];