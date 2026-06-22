import { API_URL } from "../config/api";

export async function api<T>(
	url: string,
	options: RequestInit = {},
): Promise<T> {
	const res = await fetch(`${API_URL}${url}`, {
		...options,
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			...(options.headers || {}),
		},
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.message || "API Error");
	}

	return data;
}
