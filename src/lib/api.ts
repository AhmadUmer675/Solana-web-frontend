/**
 * API Configuration
 * Base URL for backend API
 */
const API_BASE_URL = "http://44.204.116.127/api";

export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

/**
 * Generic API request function
 */
export async function apiRequest<T = any>(
	endpoint: string,
	options: RequestInit = {},
): Promise<ApiResponse<T>> {
	try {
		const url = `${API_BASE_URL}${endpoint}`;
		const headers: HeadersInit = {
			...options.headers,
		};

		if (!(options.body instanceof FormData)) {
			(headers as any)["Content-Type"] = "application/json";
		}

		const response = await fetch(url, {
			...options,
			headers,
		});

		const data = await response.json();

		if (!response.ok) {
			return {
				success: false,
				error: data.error || `HTTP error! status: ${response.status}`,
			};
		}

		return {
			success: true,
			data,
			...data,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Network error occurred",
		};
	}
}

export default apiRequest;
