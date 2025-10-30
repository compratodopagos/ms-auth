import styles from "./Regulatory.module.css";

import React from "react";
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
    Terms
} from '../../../icons'
import { Outlet } from "react-router-dom";

const renderIcon = (param, active = false) => {
    const color = `var(--color-${active ? 'accent' : 'primary'})`;
    switch (param) {
        case "residence":
            return <HomeIcon width={30} color={color} />;
        case "country":
            return <FlagIcon width={26} color={color} />;
        case "ocupation":
            return <Folder className="w-6" />;
        case "statement":
            return <Law className="w-7" />;
        case "terms":
            return <Terms className="w-5" />;
        default:
            return null;
    }
};

const Regulatory = () => {
    const { regulatory } = useRegulatoryFlow();
    const { pathname } = useLocation();
    const currentStep = useMemo(() => {
        return regulatory.find(step => pathname.startsWith(step.path));
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
                                            {renderIcon(step.id, step.id == currentStep.id)}
                                        </IconCardCircle>
                                        <div className="mt-2">
                                            <label class="font-bold text-xs md:text-sm">{step.title}</label>
                                        </div>
                                    </Link>
                                </div>
                            ))
                    }
                </div>
            </div>

            {
                regulatory.length > 0 && (
                    <Card title="" className={`${styles.card}`}>
                        <div className="text-primary">
                            <h2 className="font-bold">{currentStep.description}</h2>
                            <Outlet />
                        </div>
                    </Card>
                )
            }
        </div>
    );
};

export default Regulatory;
