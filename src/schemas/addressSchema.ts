export const addressSchema = {
    department: {
        type: 'select',
        label: 'Departamento',
        required: true
    },
    city: {
        type: 'select',
        label: 'Ciudad o municipio principal',
        required: true
    },
    type_road: {
        type: 'select',
        label: 'Tipo de vía',
        options: [
            {
                label: 'Avenida',
                value: 'Avenida'
            },
            {
                label: 'Avenida Calle',
                value: 'Avenida Calle'
            },
            {
                label: 'Avenida Carrera',
                value: 'Avenida Carrera'
            },
            {
                label: 'Calle',
                value: 'Calle'
            },
            {
                label: 'Carrera',
                value: 'Carrera'
            },
            {
                label: 'Circular',
                value: 'Circular'
            },
            {
                label: 'Diagonal',
                value: 'Diagonal'
            },
            {
                label: 'Transversal',
                value: 'Transversal'
            },
            {
                label: 'Manzana',
                value: 'Manzana'
            },
            {
                label: 'Kilómetro',
                value: 'Kilómetro'
            },
            {
                label: 'Vereda',
                value: 'Vereda'
            },
            {
                label: 'Troncal',
                value: 'Troncal'
            },
            {
                label: 'Vía',
                value: 'Vía'
            },
            {
                label: 'Autopista',
                value: 'Autopista'
            },
            {
                label: 'Pasaje',
                value: 'Pasaje'
            },
            {
                label: 'Camino',
                value: 'Camino'
            },
            {
                label: 'Carretera',
                value: 'Carretera'
            },
            {
                label: 'Entrada',
                value: 'Entrada'
            },
            {
                label: 'Bulevar',
                value: 'Bulevar'
            },
        ],
        required: true
    },
    name_road: {
        type: 'text',
        label: 'Nombre o número de la vía',
        required: true
    },
    number: {
        type: 'text',
        label: 'Número',
        required: true
    },
    details: {
        type: 'text',
        label: 'Detalles adicionales (opcional)',
        required: false
    },
    postal_code: {
        type: 'text',
        label: 'Código postal',
        required: true
    },
    empty: {
        type: 'space',
        required: false
    }
};