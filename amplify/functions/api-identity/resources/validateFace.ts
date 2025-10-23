import AWS from 'aws-sdk';
import sharp from 'sharp';

const rekognition = new AWS.Rekognition();
const s3 = new AWS.S3();

export const validateFace = async (bucketName: string, imageKey: string) => {
    try {
        // 1️⃣ Descargar imagen original
        const s3Obj = await s3.getObject({ Bucket: bucketName, Key: imageKey }).promise();
        const originalBuffer = s3Obj.Body as Buffer;

        // 2️⃣ Crear versión mejorada para detección
        const enhancedBuffer = await sharp(originalBuffer)
            .rotate()
            .resize({ width: 2000, withoutEnlargement: true })
            .modulate({ brightness: 1.05, saturation: 1.05 })
            .sharpen()
            .jpeg({ quality: 95 })
            .toBuffer();

        // 3️⃣ Detectar rostro
        const detectParams: AWS.Rekognition.DetectFacesRequest = {
            Image: { Bytes: enhancedBuffer },
            Attributes: ['ALL'],
        };
        const detectResult = await rekognition.detectFaces(detectParams).promise();
        const face = detectResult.FaceDetails?.[0];
        if (!face) {
            console.log('No se detectó rostro');
            return { isValid: false };
        }

        // 4️⃣ Recortar rostro según BoundingBox
        const { BoundingBox } = face;
        if (!BoundingBox) return { isValid: false };

        const image = sharp(enhancedBuffer);
        const metadata = await image.metadata();

        const left = Math.floor((BoundingBox.Left || 0) * (metadata.width || 0));
        const top = Math.floor((BoundingBox.Top || 0) * (metadata.height || 0));
        const width = Math.floor((BoundingBox.Width || 0) * (metadata.width || 0));
        const height = Math.floor((BoundingBox.Height || 0) * (metadata.height || 0));

        const croppedBuffer = await image
            .extract({ left, top, width, height })
            .resize(600, 600, { fit: 'cover' }) // rostro centrado
            .jpeg({ quality: 95 })
            .toBuffer();

        // 5️⃣ Guardar imagen facial recortada en S3
        const facialKey = imageKey.replace(/\.[^/.]+$/, '') + '-cropped.jpg';
        await s3
            .putObject({
                Bucket: bucketName,
                Key: facialKey,
                Body: croppedBuffer,
                ContentType: 'image/jpeg',
            })
            .promise();

        console.log(`✅ Rostro recortado y guardado en S3: ${facialKey}`);

        // 6️⃣ Validar calidad del rostro
        const quality = face.Quality || {};
        const confidence = face.Confidence || 0;
        const isValid = confidence > 90 && (quality.Brightness || 0) > 30;

        return {
            isValid,
            confidence,
            facialKey,
            quality,
        };
    } catch (error) {
        console.error('Error in Rekognition:', error);
        return {
            isValid: false
        };
    }
};
