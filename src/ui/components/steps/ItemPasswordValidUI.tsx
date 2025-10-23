import { CheckCircle, Ellipse, ErrorFilled } from "../../icons";
import { useState } from 'react';

export const ItemPasswordValidUI = ({
    label,
    errors,
    validator
}) => {

    const [success, setSuccess] = useState<boolean>(false);

    return (
        <div className="flex py-1">
            {
                errors?.[validator] ?
                    <>
                        <ErrorFilled className="w-6 h-6 mr-2" color="#FF9A9A" />
                        <p className='m-0' style={{ color: "#FF9A9A" }}>{label}</p>
                    </>
                    :
                    (
                        errors?.uncheck ?
                            <>
                                <Ellipse className='w-6 h-6 mr-2' stroke='#C7C7CC' />
                                <p className='m-0'>{label}</p>
                            </>
                            :
                            <>
                                <CheckCircle color="var(--color-accent)" stroke="var(--color-primary)" className='w-6 h-6 mr-2' />
                                <p className='m-0'>{label}</p>
                            </>
                    )
            }
        </div>
    );
}