import AWS from 'aws-sdk';

import { cedulaAntigua } from "../mapData/cedulaAntigua";
import { cedulaExtrangeria } from "../mapData/cedulaExtrangeria";
import { cedulaNueva } from "../mapData/cedulaNueva";
import { pasaporte } from "../mapData/pasaporte";

const rekognition = new AWS.Rekognition();

export const validateDocument = async (bucketName: string, imageKey: string, document_type?:string) => {
    console.log('bucketName', bucketName)
    console.log('imageKey', imageKey)
    const params: AWS.Rekognition.DetectTextRequest = {
        Image: { S3Object: { Bucket: bucketName, Name: imageKey } },
    };

    try {
        console.log('Validating document...');
        const result = await rekognition.detectText(params).promise();
        const detectedTexts = result.TextDetections?.map(text => text.DetectedText?.toLowerCase()) || [];

        // Extraer información del documento
        const documentData = extractDocumentData(detectedTexts, document_type);

        // Palabras clave para identificar el tipo de documento
        const documentTypes: any = {
            "passport": "Pasaporte",
            "cédula de ciudadanía": "Cédula de Ciudadanía",
            "ciudadanía": "Cédula de Ciudadanía",
            "cédula de extranjería": "Cédula de Extranjería",
            "id": "Documento de Identidad",
            "registrador nacional": "Cédula de Ciudadanía"
        };

        let detectedType = "";
        for (const key in documentTypes) {
            if (detectedTexts.some(text => text?.includes(key))) {
                detectedType = documentTypes[key];
                break;
            }
        }

        // Validar si es un documento
        const isDocument = detectedType !== "";

        return { isValid: isDocument, documentType: detectedType, documentData };
    } catch (error) {
        console.error('Error in Rekognition:', error);
        return { isValid: false, documentType: "", documentData: {} };
    }
};

const extractDocumentData = (detectedTexts: (string | undefined)[], document_type?:string): Record<string, string> => {
    let data: Record<string, string> = {};

    console.log('entre en extractDocumentData', detectedTexts)

    if (detectedTexts.find((text: any) => text?.normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes('ciudadania'))) {
        data.document_type = 'CC';
    } else if (detectedTexts.find((text) => text?.includes('pasaporte'))) {
        data.document_type = 'PP';
    } else if (detectedTexts.find((text) => text?.normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes('extranjeria'))) {
        data.document_type = 'CE';
    } else if (document_type){
        data.document_type = document_type;
    }

    switch (data.document_type) {
        case 'PP':
            data = pasaporte(detectedTexts);
            break;
        
        case 'CE':
            data = cedulaExtrangeria(detectedTexts);
            break;
    
        default:
            let isNew = detectedTexts.find((text) => (text && text.includes('nuip')));
            data = isNew ? cedulaNueva(detectedTexts) : cedulaAntigua(detectedTexts);
            break;
    }

    return data;
};