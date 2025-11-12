import { useState, useRef } from 'react';
import { Card, Button, Preloader } from '@compratodo/ui-components';
import { useRegisterFlow } from '../../../../../../core/presentation/hooks';

const AttorneyStep = () => {
    const { setAttorney } = useRegisterFlow();
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');
    const [fileBase64, setFileBase64] = useState < string | null > (null);
    const [filePreview, setFilePreview] = useState < string | null > (null);
    const [filename, setFilename] = useState < string | null > (null);
    const [error, setError] = useState < string | null > (null);

    const fileInputRef = useRef < HTMLInputElement | null > (null);
    const maxFileSize = 50 * 1024 * 1024; // 50 MB
    const options = ['Representante Legal', 'Apoderado/a'];

    const handleSelectRole = (value) => {
        setSelectedRole(value);
        setError(null);
        setFileBase64(null);
        setFilePreview(null);
        setFilename(null);
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelected = (event) => {
        setError(null);
        setFileBase64(null);
        setFilePreview(null);
        setFilename(null);

        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > maxFileSize) {
            setError('El archivo no puede superar los 50 MB.');
            return;
        }

        const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            setError('Formato inválido. Solo se aceptan PDF, JPG y PNG.');
            return;
        }

        // Convertir a Base64
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result;
            setFileBase64(base64);
        };
        reader.onerror = () => setError('Error al leer el archivo.');
        reader.readAsDataURL(file);

        if (file.type.startsWith('image/')) {
            setFilePreview(URL.createObjectURL(file));
        } else {
            setFilename(file.name);
        }
    };

    const removeFile = () => {
        if (fileInputRef.current) fileInputRef.current.value = '';
        setFilePreview(null);
        setFileBase64(null);
        setFilename(null);
    };

    const validButton = () => {
        if (!selectedRole) return true;
        if (selectedRole === 'Apoderado/a' && !fileBase64) return true;
        return false;
    };

    const handleSubmit = async () => {
        setError(null);
        setLoading(true);

        try {
            if (selectedRole === 'Apoderado/a' && fileBase64) {
                const payload = {
                    documentType: 'power_of_attorney',
                    file: fileBase64,
                    mimeType: fileBase64.split(';')[0].split(':')[1],
                    role: selectedRole
                };
                const errorMsg = await setAttorney(payload);
                if (errorMsg) throw new Error(errorMsg);
            } else {
                const errorMsg = await setAttorney({ role: selectedRole });
                if (errorMsg) throw new Error(errorMsg);
            }
        } catch (err) {
            setError(err.message || 'Error al procesar la solicitud.');
        }

        setLoading(false);
    };

    return (
        <Card className="max-w-[700px] mx-auto text-center">
            <div>
                <h2 className="text-lg font-semibold mb-2">
                    ¿Cuál es tu rol principal en la empresa o negocio?
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                    Ten en cuenta que debes tener un documento legal que te autorice a actuar en nombre de la empresa o negocio.
                </p>

                <div className="space-y-3 mb-6 text-left">
                    {options.map((opt) => (
                        <div
                            key={opt}
                            onClick={() => handleSelectRole(opt)}
                            className={`cursor-pointer border rounded-md p-3 flex justify-between items-center ${selectedRole === opt ? 'border-(--color-primary) bg-blue-50' : 'border-gray-300'
                                }`}
                        >
                            <span>{opt}</span>
                            <input
                                type="radio"
                                name="attorney"
                                checked={selectedRole === opt}
                                onChange={() => handleSelectRole(opt)}
                                className="w-5 h-5 accent-(--color-primary)"
                            />
                        </div>
                    ))}
                </div>

                {/* Si selecciona Apoderado/a, mostrar campo de archivo */}
                {selectedRole === 'Apoderado/a' && (
                    <div className="border border-dashed border-gray-300 p-6 rounded-lg mb-4 text-center bg-gray-50">
                        <div onClick={triggerFileInput} className="cursor-pointer">
                            <p className="text-sm text-gray-700">
                                <b>Adjunta la documentación</b> o arrástrala aquí.<br />
                                Hasta 50MB en jpg, jpeg, png o pdf.
                            </p>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelected}
                            accept=".pdf, .jpg, .jpeg, .png"
                            className="hidden"
                        />

                        {filename && (
                            <div className="flex justify-between items-center mt-3 bg-white border rounded p-2">
                                <div className="flex items-center gap-2 text-sm">
                                    📄 <span>{filename}</span>
                                </div>
                                <button
                                    type="button"
                                    className="text-(--color-danger) text-xs underline"
                                    onClick={removeFile}
                                >
                                    Eliminar
                                </button>
                            </div>
                        )}

                        {filePreview && (
                            <div className="mt-4 flex justify-center">
                                <img
                                    src={filePreview}
                                    alt="Vista previa"
                                    className="max-h-[200px] rounded border"
                                />
                            </div>
                        )}
                    </div>
                )}

                {error && (
                    <div className="text-(--color-danger) text-sm mb-3">
                        * {error}
                    </div>
                )}

                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={loading || validButton()}
                >
                    {loading ? <Preloader /> : 'Continuar'}
                </Button>
            </div>
        </Card>
    );
};

export default AttorneyStep;