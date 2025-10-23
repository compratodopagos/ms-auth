import { get, post, put, del } from "aws-amplify/api";

interface RequestOptions {
    body?: any;
    withCredentials?: boolean;
    headers?: Record<string, string>;
    queryParams?: Record<string, string>;
}

const API_NAME = "authRestApi";

const normalizeQueryParams = (
    queryParams?: Record<string, string | number | boolean | undefined>
): Record<string, string> | undefined => {
    if (!queryParams) return undefined;

    const normalized: Record<string, string> = {};
    Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined) normalized[key] = String(value);
    });
    return normalized;
};

export const apiService = {
    async get(path: string, options: RequestOptions = {}): Promise<any> {
        try {
            const { body } = await get({
                apiName: API_NAME,
                path,
                options: {
                    withCredentials: options.withCredentials ?? true,
                    headers: options.headers,
                    queryParams: normalizeQueryParams(options.queryParams),
                },
            }).response;

            return await body.json();
        } catch (error: any) {
            throw handleApiError(path, error);
        }
    },

    async post(path: string, data?: any, options: RequestOptions = {}): Promise<any> {
        try {
            const e = localStorage.getItem("e");
            const body = { ...data, ...(e ? { email: e } : {}) };

            const { body: responseBody } = await post({
                apiName: API_NAME,
                path,
                options: {
                    ...options,
                    body,
                    withCredentials: options.withCredentials ?? true,
                    queryParams: normalizeQueryParams(options.queryParams),
                },
            }).response;

            return await responseBody.json();
        } catch (error: any) {
            throw handleApiError(path, error);
        }
    },

    async put(path: string, data: any, options: RequestOptions = {}): Promise<any> {
        try {
            const e = localStorage.getItem("e");
            const body = { ...data, ...(e ? { email: e } : {}) };
            const { body: responseBody } = await put({
                apiName: API_NAME,
                path,
                options: {
                    ...options,
                    body,
                    withCredentials: options.withCredentials ?? true
                },
            }).response;

            return await responseBody.json();
        } catch (error: any) {
            throw handleApiError(path, error);
        }
    },

    async delete(path: string, options: RequestOptions = {}): Promise<any> {
        try {
            const { body } = await del({
                apiName: API_NAME,
                path,
                options: {
                    ...options,
                    withCredentials: options.withCredentials ?? true,
                    queryParams: normalizeQueryParams(options.queryParams),
                },
            }).response;

            return await body.json();
        } catch (error: any) {
            throw handleApiError(path, error);
        }
    },
};

const handleApiError = (path: string, error: any) => {
    try {
        const { error: err, message, details, requiresCaptcha } = JSON.parse(error.response?.body || "{}");

        if (message?.includes("Token inválido") || message?.includes("expirado")) {
            localStorage.removeItem("access_token");
            window.location.pathname = "/login";
        }

        console.error(`[API ERROR] ${path}:`, message || err);
        return { error: true, message: message || details || err, requiresCaptcha };
    } catch {
        console.error(`[API ERROR] ${path}:`, error);
        return { error: true, message: "Error desconocido" };
    }
};