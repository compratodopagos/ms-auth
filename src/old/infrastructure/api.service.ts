// src/infrastructure/api/api.service.ts
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || "";
  }

  private buildUrl(url: string, params?: Record<string, any>) {
    if (!params) return `${this.baseUrl}${url}`;
    const query = new URLSearchParams(
      Object.entries(params)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString();
    return `${this.baseUrl}${url}?${query}`;
  }

  private async request<T>(
    url: string,
    method: HttpMethod,
    body?: any,
    options?: FetchOptions
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options?.headers,
    };

    // puedes manejar token automáticamente aquí
    const token = localStorage.getItem("access_token");
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const config: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    };

    const response = await fetch(this.buildUrl(url, options?.params), config);

    // Manejo de errores global
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Ocurrió un error inesperado";

      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    // Si no hay contenido (ej. DELETE 204)
    if (response.status === 204) return {} as T;

    const data = await response.json();
    return data as T;
  }

  get<T>(url: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(url, "GET", undefined, options);
  }

  post<T>(url: string, body?: any, options?: FetchOptions): Promise<T> {
    return this.request<T>(url, "POST", body, options);
  }

  put<T>(url: string, body?: any, options?: FetchOptions): Promise<T> {
    return this.request<T>(url, "PUT", body, options);
  }

  delete<T>(url: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(url, "DELETE", undefined, options);
  }
}

export const apiService = new ApiService();
