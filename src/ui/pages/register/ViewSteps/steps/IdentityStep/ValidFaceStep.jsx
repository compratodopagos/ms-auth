import styles from './ValidFaceStep.module.css';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, Button, Preloader } from '@compratodo/ui-components';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';

import { FaceValid } from '../../../../../icons';
import { dictionary } from '../../../../../i18n/dictionary';
import { useRegisterFlow } from '../../../../../../presentation/hooks/useRegisterFlow';

const ValidFaceStep = ({
    region = 'us-east-1'
}) => {
    const [sessionId, setSessionId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [errorCount, setErrorCount] = useState(1);
    const navigate = useNavigate();

    const { startLivenessSession, getResultLivenessSession } = useRegisterFlow();

    const startLiveness = async () => {
        setLoading(true);
        try {
            const { sessionId, message } = await startLivenessSession();
            if (!sessionId) {
                if (message == 'Usuario no autenticado') {
                    navigate('/login');
                }
            }
            setSessionId(sessionId);
        } catch (err) {
            console.error("Error creando sesión:", err);
        } finally {
            setLoading(false);
        }
    };

    const onAnalysisComplete = async () => {
        if (sessionId) {
            const { isMatch } = await getResultLivenessSession(sessionId);
            if (isMatch) {
                navigate('/register/steps');
            } else {
                setError('Hubo un error, intenta nuevamente');
                if (errorCount <= 3) {
                    setTimeout(() => {
                        setSessionId(null);
                    }, 500);
                }
                setErrorCount(errorCount + 1);
            }
        }
    }

    const onError = (error) => {
        console.log(error);
    }

    return (
        <Card title="" className={`${styles.card} container flex justify-center items-center relative`}>
            <div className={`${styles.info} text-center`}>
                <h2>Procederemos a escanear tu rostro</h2>
                <p>Ubícate en un espacio bien iluminado para confirmar tu identidad con el documento presentado</p>
                {error && <span className="text-[var(--color-danger)]">* {error}</span>}

                <div className={`${styles.cardDoc} rounded-lg cursor-pointer`}>
                    <div className='w-full'>
                        {
                            sessionId ?
                                <FaceLivenessDetector
                                    sessionId={sessionId}
                                    region={region}
                                    displayText={dictionary['es']}
                                    components={{
                                        PhotosensitiveWarning: () => {
                                            return (<></>);
                                        }
                                    }}
                                    onAnalysisComplete={() => onAnalysisComplete()}
                                    onError={(err) => onError(err)}
                                />
                                :
                                <>
                                    <div className="flex justify-center mb-2">
                                        <FaceValid />
                                    </div>
                                    <div className="flex justify-center">
                                        {loading ? <Preloader /> : <Button variant='light' onClick={() => startLiveness()}>Escanear</Button>}
                                    </div>
                                </>
                        }
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default ValidFaceStep;