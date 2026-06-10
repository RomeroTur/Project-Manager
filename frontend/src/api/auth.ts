const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export type Role = "admin" | "user";

export interface AuthUser {
	_id: string;
	firstname: string;
	lastname: string;
	email: string;
	role: Role;
}

export interface LoginPayload {
	email: string;
	password: string;
}

export interface RegisterPayload {
	firstname: string;
	lastname: string;
	email: string;
	password: string;
	role: Role;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
	const res = await fetch(`${BASE_URL}${path}`, {
		...options,
		credentials: "include", // send/receive httpOnly cookies
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data?.message ?? "Request failed");
	}

	return data as T;
}

export async function apiLogin(
	payload: LoginPayload,
): Promise<{ msg: string; token: string }> {
	return request("/auth/login", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export async function apiRegister(
	payload: RegisterPayload,
): Promise<{ msg: string }> {
	return request("/auth/register", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export async function apiLogout(): Promise<{ msg: string }> {
	return request("/auth/logout", { method: "POST" });
}

export async function apiGetMe(): Promise<AuthUser> {
	return request("/auth/me");
}
