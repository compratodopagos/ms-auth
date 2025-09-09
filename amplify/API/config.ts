import { Stack } from "aws-cdk-lib";
import { AuthorizationType, Cors, LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

export function configApi(backend: any) {

    // Crear un nuevo stack para la API
    const apiStack = backend.createStack("api-auth-stack");
    const domain: string[] = [];

    if(process.env.public_path){
        domain.push(process.env.public_path);
    } else {
        domain.push('http://localhost:4200');
        domain.push('http://localhost:4201');
    }

    const envDefault = ['SHELL_URL','ADM_MICROSERVICE_URL'];
    envDefault.forEach(def => {
        if(process.env[def]){
            domain.push(process.env[def])
        }
    })

    if(!process.env.stageName || process.env.stageName == 'dev'){
        domain.push('http://localhost:4204')
    }

    // Crear la API REST
    const authRestApi = new RestApi(apiStack, "RestApi", {
        restApiName: "authRestApi",
        deploy: true,
        deployOptions: {
            stageName: process.env.stageName || "local",
        },
        defaultCorsPreflightOptions: {
            allowOrigins: domain,
            allowMethods: Cors.ALL_METHODS,
            allowHeaders: Cors.DEFAULT_HEADERS,
            allowCredentials: true
        },
    });

    const lambdas = [
        {
            path: 'login',
            lambda: backend.loginApiFunction,
            policies: []
        },
        {
            path: 'terms',
            lambda: backend.termsApiFunction,
            policies: []
        },
        {
            path: 'user',
            lambda: backend.userApiFunction,
            policies: []
        },
        {
            path: 'identity',
            lambda: backend.identityApiFunction,
            policies: [
                {
                    actions: [
                        'rekognition:DetectText',
                        'rekognition:DetectFaces',
                        'rekognition:CompareFaces',
                        'rekognition:CreateFaceLivenessSession',
                        'rekognition:GetFaceLivenessSessionResults'
                    ],
                    resources: ['*']
                }
            ]
        }
    ];

    lambdas.forEach((itemLambda) => {
        // Verificar si la Lambda está definida
        if (!itemLambda.lambda || !itemLambda.lambda.resources?.lambda) {
            throw new Error(`Lambda (${itemLambda.path}) no está definida. Asegúrate de haber creado una función Lambda.`);
        }

        // Integración con la Lambda
        const lambdaIntegration = new LambdaIntegration(
            itemLambda.lambda.resources.lambda
        );

        // Permisos de IAM para acceder a Secrets Manager
        itemLambda.lambda.resources.lambda.addToRolePolicy(new PolicyStatement({
            actions: ['secretsmanager:GetSecretValue'], // Permitir la acción GetSecretValue
            resources: [
                'arn:aws:secretsmanager:us-east-1:127214183584:secret:ctp/dev/*',
            ]// Reemplaza con el ARN correcto del secreto
        }));
        
        itemLambda.policies.forEach((policy) => {
            itemLambda.lambda.resources.lambda.addToRolePolicy(new PolicyStatement({
                actions: policy.actions,
                resources: policy.resources
            }))
        })

        // Crear recurso "terms" en la API sin autenticación
        const itemsPath = authRestApi.root.addResource(itemLambda.path, {
            defaultMethodOptions: {
                authorizationType: AuthorizationType.NONE, // Permitir acceso sin autenticación
            },
        });

        // Métodos disponibles
        itemsPath.addMethod("GET", lambdaIntegration);
        itemsPath.addMethod("POST", lambdaIntegration);
        itemsPath.addMethod("DELETE", lambdaIntegration);
        itemsPath.addMethod("PUT", lambdaIntegration);

        // Agregar un proxy para manejar rutas dinámicas
        itemsPath.addProxy({
            anyMethod: true,
            defaultIntegration: lambdaIntegration,
        });
    });

    // Agregar información de salida
    backend.addOutput({
        custom: {
            API: {
                [authRestApi.restApiName]: {
                    endpoint: authRestApi.url,
                    region: Stack.of(authRestApi).region,
                    apiName: authRestApi.restApiName,
                },
            },
        },
    });

}
