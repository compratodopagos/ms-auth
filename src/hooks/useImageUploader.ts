import { useState, useRef } from "react";
import { centerCrop, Crop, makeAspectCrop, PercentCrop } from "react-image-crop";

const MAX_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export type Side = "front" | "back";

export const useImageUploader = () => {
    const [error, setError] = useState<string>();
    const [cropImage, setCropImage] = useState<string | null>(null); // URL para UI (blob:)
    const [croppingSide, setCroppingSide] = useState<Side | null>(null);
    const [frontImage, setFrontImage] = useState<string | null>(null); // base64 result
    const [backImage, setBackImage] = useState<string | null>(null);
    const originalImageRef = useRef<HTMLImageElement | null>(null); // la imagen original (alta res)
    const originalObjectUrlRef = useRef<string | null>(null); // para revokeObjectURL

    const [crop, setCrop] = useState<Crop>({
        x: 0,
        y: 0,
        unit: "%",
        width: 90,
        height: 100,
    });
    const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);

    const fileInputFront = useRef<HTMLInputElement>(null);
    const fileInputBack = useRef<HTMLInputElement>(null);

    const resetError = () => setError(undefined);

    const createCenteredCrop = (
        mediaWidth: number,
        mediaHeight: number,
        aspect: number
    ): PercentCrop => {
        return centerCrop(
            makeAspectCrop(
                {
                    unit: "%",
                    width: 90, // porcentaje inicial
                },
                aspect,
                mediaWidth,
                mediaHeight
            ),
            mediaWidth,
            mediaHeight
        );
    };

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget as HTMLImageElement;
        const displayWidth = img.clientWidth || img.getBoundingClientRect().width;
        const displayHeight = img.clientHeight || img.getBoundingClientRect().height;
        const newCrop = createCenteredCrop(displayWidth, displayHeight, 2);
        requestAnimationFrame(() => {
            setCrop(newCrop);
            setCompletedCrop(newCrop);
        });
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: Side) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!ALLOWED_TYPES.includes(file.type)) {
            setError("Formato inválido. Solo se permiten JPG, JPEG y PNG.");
            return;
        }
        if (file.size > MAX_SIZE) {
            setError("El archivo excede los 50 MB.");
            return;
        }

        // limpiar URL previa si existe
        if (originalObjectUrlRef.current) {
            try { URL.revokeObjectURL(originalObjectUrlRef.current); } catch { }
            originalObjectUrlRef.current = null;
            originalImageRef.current = null;
        }

        // Crear objectURL (mantiene la data original sin compresión)
        const objectUrl = URL.createObjectURL(file);
        originalObjectUrlRef.current = objectUrl;

        // Mostrar en UI (react-image-crop) con ese objectURL
        setCropImage(objectUrl);
        setCroppingSide(side);
        setCompletedCrop(null);

        // Crear una imagen en memoria que guardamos como "original"
        const originalImg = new Image();
        // no hace falta crossOrigin para blob:
        originalImg.onload = () => {
            originalImageRef.current = originalImg;
            // ya tenemos naturalWidth/naturalHeight listos
        };
        originalImg.onerror = () => {
            setError("No se pudo cargar la imagen original.");
        };
        originalImg.src = objectUrl;
    };

    /**
     * getCroppedImg: mantiene la firma (image: displayed image, crop)
     * pero SI existe originalImageRef.current, aplica el recorte en la imagen original
     * y devuelve dataURL en alta resolución.
     */
    const getCroppedImg = (displayedImage: HTMLImageElement, crop: Crop): string => {
        if (!crop?.width || !crop?.height) {
            throw new Error("No se definió un recorte válido");
        }

        // Preferir la imagen original (alta resolución) si ya está cargada.
        const original = originalImageRef.current ?? displayedImage;
        if (!original) throw new Error("Imagen no disponible para recortar");

        let origX: number, origY: number, origW: number, origH: number;

        // Si crop está en porcentajes, mapeamos directamente a naturalWidth/naturalHeight
        if (crop.unit === "%") {
            origX = (crop.x / 100) * original.naturalWidth;
            origY = (crop.y / 100) * original.naturalHeight;
            origW = (crop.width / 100) * original.naturalWidth;
            origH = (crop.height / 100) * original.naturalHeight;
        } else {
            // crop en px relativos a la imagen mostrada => necesitamos ratio entre original y mostrado
            const displayed = displayedImage ?? original;
            const displayedW = displayed.clientWidth || displayed.width || original.naturalWidth;
            const displayedH = displayed.clientHeight || displayed.height || original.naturalHeight;
            const ratioX = original.naturalWidth / displayedW;
            const ratioY = original.naturalHeight / displayedH;

            origX = crop.x * ratioX;
            origY = crop.y * ratioY;
            origW = crop.width * ratioX;
            origH = crop.height * ratioY;
        }

        // Normalizar y evitar 0
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(origW));
        canvas.height = Math.max(1, Math.round(origH));

        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("No se pudo obtener contexto 2D");

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(
            original,
            Math.round(origX),
            Math.round(origY),
            Math.round(origW),
            Math.round(origH),
            0,
            0,
            canvas.width,
            canvas.height
        );

        // Retorna base64 en alta calidad (puedes ajustar calidad si necesitas menor peso)
        return canvas.toDataURL("image/jpeg", 0.95);
    };

    const cancelCrop = () => {
        // revocar URL si hay
        if (originalObjectUrlRef.current) {
            try { URL.revokeObjectURL(originalObjectUrlRef.current); } catch { }
            originalObjectUrlRef.current = null;
        }
        originalImageRef.current = null;
        setCropImage(null);
        if (croppingSide === "front" && fileInputFront.current)
            fileInputFront.current.value = "";
        if (croppingSide === "back" && fileInputBack.current)
            fileInputBack.current.value = "";
        setCroppingSide(null);
    };

    // helper público para liberar URL si quieres hacerlo explícitamente luego del upload
    const clearOriginalObjectURL = () => {
        if (originalObjectUrlRef.current) {
            try { URL.revokeObjectURL(originalObjectUrlRef.current); } catch { }
            originalObjectUrlRef.current = null;
        }
        originalImageRef.current = null;
    };

    return {
        error,
        cropImage,
        croppingSide,
        frontImage,
        backImage,
        crop,
        setCrop,
        completedCrop,
        setCompletedCrop,
        imgRef,
        fileInputFront,
        fileInputBack,
        onFileChange,
        onImageLoad,
        cancelCrop,
        resetError,
        setError,
        setFrontImage,
        setBackImage,
        setCropImage,
        getCroppedImg,
        setCroppingSide,
        clearOriginalObjectURL,
    };
};