import AWS from 'aws-sdk';
const rekognition = new AWS.Rekognition();

export const validateFace = async (bucketName: string, imageKey: string) => {
    const params: AWS.Rekognition.DetectFacesRequest = {
        Image: { S3Object: { Bucket: bucketName, Name: imageKey } },
        Attributes: ['ALL'],
    };

    try {
        console.log('Validating face...');
        const result = await rekognition.detectFaces(params).promise();


        const face = result.FaceDetails?.[0];
        console.log('face',face)

        if (!face) return false;
        return (face.Confidence || 0) > 90 && (face.Quality?.Brightness || 0) > 30;
    } catch (error) {
        console.error('Error in Rekognition:', error);
        return false;
    }
};