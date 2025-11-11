import styles from "./Regulatory.module.css";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMemo } from "react";

import { Card, Preloader } from "@compratodo/ui-components";

import { useRegulatoryFlow } from "@core/presentation/hooks";
import IconCardCircle from "../../../icons/IconCardCircle";

import {
    HomeIcon,
    FlagIcon,
} from "lucide-react";

import {
    Folder,
    Law,
    Terms as TermsIcon
} from '../../../icons'
import { Country, Ocupation, Address, Statement, Terms } from "./steps";

const renderIcon = (param, active = false) => {
    const color = `var(--color-${active ? 'accent' : 'primary'})`;
    switch (param) {
        case "residence":
            return <HomeIcon width={30} color={color} />;
        case "country":
            return <FlagIcon width={26} color={color} />;
        case "ocupation":
            return <Folder className="w-6" stroke={color} />;
        case "statement":
            return <Law className="w-7" stroke={color} />;
        case "terms":
            return <TermsIcon className="w-5" stroke={color} />;
        default:
            return null;
    }
};

const Regulatory = () => {
    const regulatoryFlow = useRegulatoryFlow();
    const {
        regulatory
    } = regulatoryFlow;
    const [error, setError] = useState();
    const { pathname } = useLocation();
    const currentStep = useMemo(() => {
        return regulatory.find(step => pathname == step.path);
    }, [regulatory, pathname]);

    return (
        <div className={`${styles.container} ${styles.steps} text-center`}>
            <div className="flex justify-center mb-4">
                <div className={`${styles.info}`}>
                    <h1>Datos Regulatorios</h1>
                </div>
            </div>
            <div className="relative flex justify-center">
                <div className={`flex justify-between mb-5 ${regulatory.length && styles.sectIcons}`}>
                    {
                        !regulatory.length ?
                            <Preloader />
                            :
                            regulatory.map((step, idx) => (
                                <div className={`${styles.circleIcon}`} key={idx}>
                                    <Link to={step.path}>
                                        <IconCardCircle
                                            styleIcon={styles.styleIcon}
                                            sectIcon={(step.completed || step.id == currentStep.id) ? styles.sectIconActive : styles.sectIcon}
                                        >
                                            {renderIcon(step.id, (step.completed || step.id == currentStep.id))}
                                        </IconCardCircle>
                                        <div className="mt-2">
                                            <label className="font-bold text-xs md:text-sm">{step.title}</label>
                                        </div>
                                    </Link>
                                </div>
                            ))
                    }
                </div>
            </div>
            {regulatory.length > 0 && (
                <Card title="" className={`${styles.card}`}>
                    <div className="text-primary">
                        <div className="flex justify-center">
                            <h2 className="font-bold mb-[50px] max-w-[350px]">{currentStep.description}</h2>
                        </div>
                        {error ? <span className='text-(--color-danger)'>* {error}</span> : null}
                        {regulatory.length && regulatory.filter(r => r.id == currentStep.id).map(step => {
                            switch (step.id) {
                                case "country":
                                    return <Country regulatoryFlow={regulatoryFlow} key={step} errorState={{ error, setError }} />;
                                case "residence":
                                    return <Address regulatoryFlow={regulatoryFlow} key={step} errorState={{ error, setError }} />;
                                case "ocupation":
                                    return <Ocupation regulatoryFlow={regulatoryFlow} key={step} errorState={{ error, setError }} />;
                                case "statement":
                                    return <Statement regulatoryFlow={regulatoryFlow} key={step} errorState={{ error, setError }} />;
                                case "terms":
                                    return <Terms regulatoryFlow={regulatoryFlow} key={step} errorState={{ error, setError }} />;
                                default:
                                    return null;
                            }
                        })}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default Regulatory;
