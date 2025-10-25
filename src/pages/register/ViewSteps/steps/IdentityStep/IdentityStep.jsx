import styles from './IdentityStep.module.css';
import 'react-image-crop/dist/ReactCrop.css';

import { useState } from 'react';
import ReactCrop from 'react-image-crop';
import { useNavigate } from 'react-router-dom';

import { Card, Button } from '@compratodo/ui-components';
import { FrontDoc, BackDoc } from '../../../../../icons';

import { useImageUploader } from '../../../../../hooks';
import { useRegisterFlow } from '../../../../../../core/presentation/hooks';

import CardDoc from './CardDoc.jsx'

const IdentityStep = () => {
    const {
        fileInputFront,
        completedCrop,
        fileInputBack,
        croppingSide,
        frontImage,
        backImage,
        cropImage,
        imgRef,
        error,
        crop,
        setCompletedCrop,
        onFileChange,
        onImageLoad,
        cancelCrop,
        setCrop,
        setError,
        setFrontImage,
        setBackImage,
        getCroppedImg,
    } = useImageUploader();
    
    const { docs, setDocument } = useRegisterFlow();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const confirmCrop = async () => {
        if (!completedCrop || !imgRef.current || !croppingSide) return;

        setLoading(true);
        const side = croppingSide; // guardar antes de cancelar/limpiar
        try {
            // obtener base64 a partir de la imagen ORIGINAL (si está cargada)
            const base64Image = getCroppedImg(imgRef.current, completedCrop);

            // setear la imagen en UI y limpiar input
            if (side === "front") {
                setFrontImage(base64Image);
                if (fileInputFront.current) fileInputFront.current.value = "";
            } else {
                setBackImage(base64Image);
                if (fileInputBack.current) fileInputBack.current.value = "";
            }

            // limpiar modal / objectURL (cancelCrop revoca URL y limpia refs)
            cancelCrop();

            // preparar payload y subir
            const fileName = side === "front" ? "front_id.jpg" : "back_id.jpg";
            const payload = {
                fileName,
                mimeType: "image/jpeg",
            };
            payload[side] = base64Image;

            const { message } = await setDocument(payload);

            if (message) {
                if (message === 'Usuario no autenticado') {
                    navigate('/login');
                    return;
                }
                // si falla, revertir UI
                if (side === "front") setFrontImage(null);
                else setBackImage(null);

                setError(message);
                return;
            }

            // si necesitas la URL s3Url, haz lo que corresponda
        } catch (err) {
            // no llamamos cancelCrop aquí porque ya lo hicimos arriba; solo mostrar error
            setError(err.message || "Error al procesar imagen");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title="" className={`${styles.card} container flex justify-center items-center relative`}>
            <div className={`${styles.info} text-center`}>
                <h2>Carga ambas caras de tu cédula de ciudadanía o extranjería</h2>
                <p>Verifica que las imágenes sean claras, a color y que todos los datos se vean. No excedas 50 MB.</p>
                {error && <span className="text-[var(--color-danger)]">* {error}</span>}

                <div className="grid-2 text-left mt-6">
                    {/* FRONT */}
                    <CardDoc
                        image={frontImage || (docs || {}).front}
                        onClick={() => fileInputFront.current?.click()}
                        alt={"Frontal documento"}
                        iconCard={(<FrontDoc className={`${styles.icon} w-100`} />)}
                        fileInput={fileInputFront}
                        onChange={(e) => onFileChange(e, "front")}
                        styles={styles}
                        loading={loading}
                    />

                    {/* BACK */}
                    <CardDoc
                        image={backImage || (docs || {}).back}
                        onClick={() => fileInputBack.current?.click()}
                        alt={"Tasera documento"}
                        iconCard={(<BackDoc className={`${styles.icon} w-100`} />)}
                        fileInput={fileInputBack}
                        onChange={(e) => onFileChange(e, "back")}
                        styles={styles}
                        loading={loading}
                    />
                </div>

                {/* Modal de recorte */}
                {cropImage && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center z-50">
                        <div className="relative w-[90%] h-[70%] bg-white rounded-lg flex flex-col justify-center items-center p-4"
                            style={{ maxWidth: '80vh' }}>
                            <ReactCrop
                                crop={crop}
                                onChange={(newCrop) => setCrop(newCrop)}
                                onComplete={(c) => setCompletedCrop(c)}
                            >
                                <img ref={imgRef} src={cropImage} alt="Crop preview" onLoad={onImageLoad} />
                            </ReactCrop>
                        </div>
                        <div className="flex gap-4 mt-4">
                            <Button variant="secondary" onClick={cancelCrop}>
                                Cancelar
                            </Button>
                            <Button onClick={confirmCrop}>Confirmar</Button>
                        </div>
                    </div>
                )}
                {(frontImage || (docs || {}).front) && (backImage || (docs || {}).back) ?
                    (<div className="flex justify-center mt-6">
                        <Button onClick={() => navigate('/register/steps/identity/valid')}>Continuar</Button>
                    </div>) : null
                }
            </div>
        </Card>
    );
};

export default IdentityStep;