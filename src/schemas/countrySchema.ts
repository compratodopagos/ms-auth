import { COUNTRIES } from "@core/constants/COUNTRIES";

export const countrySchema = {
    country: {
        name: 'country',
        type: 'radio',
        label: 'País',
        options: COUNTRIES.map((country) => ({
            value: country.name,
            label: country.name
        })),
        required: true
    }
};