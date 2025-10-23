import AWS from 'aws-sdk';
import sharp from 'sharp';

import { cedulaAntigua } from "../mapData/cedulaAntigua";
import { cedulaExtrangeria } from "../mapData/cedulaExtrangeria";
import { cedulaNueva } from "../mapData/cedulaNueva";
import { pasaporte } from "../mapData/pasaporte";

const s3 = new AWS.S3();
const rekognition = new AWS.Rekognition();

export const validateDocument = async (
    bucketName: string,
    imageKey: string,
    document_type?: string
) => {
    console.log('🧩 validateDocument start', { bucketName, imageKey });

    try {
        // 1️⃣ Descargar imagen original
        const s3Obj = await s3.getObject({ Bucket: bucketName, Key: imageKey }).promise();
        const originalBuffer = s3Obj.Body as Buffer;

        // 3️⃣ Crear versión OCR (escala grises + contraste + binarización)
        const ocrBuffer = await sharp(s3Obj.Body as Buffer)
            .grayscale()
            .normalize()
            .modulate({ brightness: 1.1 })
            .linear(1.2, -20)
            .sharpen()
            .toBuffer();

        const ocrKey = imageKey.replace(/\.[^/.]+$/, '') + '-ocr.jpg';
        await s3
            .putObject({
                Bucket: bucketName,
                Key: ocrKey,
                Body: ocrBuffer,
                ContentType: 'image/jpeg',
            })
            .promise();

        // 4️⃣ Ejecutar OCR con Rekognition
        const params: AWS.Rekognition.DetectTextRequest = {
            Image: { S3Object: { Bucket: bucketName, Name: ocrKey } },
        };

        console.log('🧠 Running Rekognition OCR...');
        const result = await rekognition.detectText(params).promise();

        const detectedTexts = result.TextDetections?.map(
            (text) => text.DetectedText?.toLowerCase()
        ) || [];

        console.log('📄 Detected texts count:', detectedTexts.length, detectedTexts);

        // 5️⃣ Extraer información del documento
        const documentData = extractDocumentData(detectedTexts, document_type);

        const documentTypes: any = {
            passport: 'Pasaporte',
            'cédula de ciudadanía': 'Cédula de Ciudadanía',
            cedula: 'Cédula de Ciudadanía',
            adania: 'Cédula de Ciudadanía',
            ciudadanía: 'Cédula de Ciudadanía',
            'cédula de extranjería': 'Cédula de Extranjería',
            id: 'Documento de Identidad',
            'registrador nacional': 'Cédula de Ciudadanía',
        };

        let detectedType = '';
        for (const key in documentTypes) {
            if (detectedTexts.some((text) => text?.includes(key))) {
                detectedType = documentTypes[key];
                break;
            }
        }

        const isDocument = detectedType !== '';

        return {
            isValid: isDocument,
            documentType: detectedType,
            documentData,
            ocrKey,
        };
    } catch (error) {
        console.error('❌ Error in validateDocument:', error);
        return { isValid: false, documentType: '', documentData: {}, error };
    }
};

// ========================================================
// EXTRAER DATOS SEGÚN DOCUMENTO
// ========================================================
const extractDocumentData = (
    detectedTexts: (string | undefined)[],
    document_type?: string
): Record<string, string> => {
    let data: Record<string, string> = {};

    if (
        detectedTexts.find((text: any) =>
            text?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes('ciudadania')
        )
    ) {
        data.document_type = 'CC';
    } else if (detectedTexts.find((text) => text?.includes('pasaporte'))) {
        data.document_type = 'PP';
    } else if (
        detectedTexts.find((text) =>
            text?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes('extranjeria')
        )
    ) {
        data.document_type = 'CE';
    } else if (document_type) {
        data.document_type = document_type;
    }

    console.log('validate:', data.document_type)

    switch (data.document_type) {
        case 'PP':
            data = pasaporte(detectedTexts);
            break;

        case 'CE':
            data = cedulaExtrangeria(detectedTexts);
            break;

        default:
            const isNew = detectedTexts.find((text) => text && text.includes('nuip'));
            data = isNew ? cedulaNueva(detectedTexts) : cedulaAntigua(detectedTexts);
            break;
    }

    return data;
};