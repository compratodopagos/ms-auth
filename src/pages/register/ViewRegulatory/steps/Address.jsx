import { Button, FormBuilder, Preloader } from "@compratodo/ui-components";
import { addressSchema } from "../../../../schemas";
import { useEffect, useState } from "react";
import { COUNTRIES } from "../../../../../core/constants/COUNTRIES";
import { Link } from 'react-router-dom';

export const Address = ({
    regulatoryFlow
}) => {

    const {
        error,
        setError,
        regulatory,
        setAddress,
        loading,
        setLoading
    } = regulatoryFlow;
    const [schema, setSchema] = useState(addressSchema);
    const [departments, setDepartments] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        const { completed } = regulatory.find(r => r.id == "country");
        setDepartments(COUNTRIES.find(c => c.name == completed).departments);

        const { completed: residence } = regulatory.find(r => r.id == "residence");
        setCities(departments.find(c => c.name == residence?.department)?.city || []);

        setSchema(prev => ({
            ...prev,
            department: {
                ...prev.department,
                options: departments.map(d => ({
                    label: d.name,
                    value: d.name
                })),
                value: residence?.department
            },
            city: {
                ...prev.city,
                options: cities.map(city => ({
                    label: city,
                    value: city
                })),
                value: residence?.city
            },
            type_road: {
                ...prev.type_road,
                value: residence?.type_road
            },
            name_road: {
                ...prev.name_road,
                value: residence?.name_road
            },
            number: {
                ...prev.number,
                value: residence?.number
            },
            details: {
                ...prev.details,
                value: residence?.details
            },
            postal_code: {
                ...prev.postal_code,
                value: residence?.postal_code
            }
        }));
    }, [regulatory, departments])

    const changeItem = ({ department }) => {
        const cities = departments.find(d => d.name == department).city;
        setSchema(prev => ({
            ...prev,
            city: {
                ...prev.department,
                options: cities.map(c => ({
                    label: c,
                    value: c
                }))
            }
        }));
    }

    const handleSubmit = async (value) => {
        setLoading(true);
        const errorMsg = await setAddress(value);
        if(errorMsg){
            setError(errorMsg);
            return;
        }
    }

    return (
        <>
            {error ? <span className='text-(--color-danger)'>* {error}</span> : null}
            <div className="flex justify-center text-left mt-6">
                <FormBuilder
                    schema={schema}
                    onSubmit={handleSubmit}
                    submitButton={(
                        <div className="flex gap-3">
                            <Button type="submit" variant="primary" disabled={loading}>
                                {loading ? <Preloader /> : 'Continuar'}
                            </Button>
                            <Link to="/register/regulatory/ocupation">
                                <Button type="submit" disabled={loading} style={{ background: '#F0F0F0', color: '#07144E' }}>
                                    {loading ? <Preloader /> : 'Diligenciar despues'}
                                </Button>
                            </Link>
                        </div>
                    )}
                    onChange={changeItem}
                    className="grid md:grid-cols-2 w-full md:max-w-[650px] md:gap-4"
                />
            </div>
        </>
    );
}