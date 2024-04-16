import { edenFetch } from "@elysiajs/eden";
import { treaty } from "@elysiajs/eden";
import type { App } from "../backend/src/";

const fetch = edenFetch<App>("http://localhost:3000");

const treatyApi = treaty<App>("http://localhost:3000");

let token: string | null = null;

const getGames = async () => {
	const games = await fetch("/games/", {});
};

export const login = async (username: string, password: string) => {
	const body = {
		username,
		password,
	};
	const result = await fetch("/accounts/login", { method: "POST", body });
	if (result.status === 200) {
		token = result.data?.token;
	}
	console.log("RESULT!!", result);
};

export const getCurrentUser = async (): Promise<string | null> => {
	if (token) {
		const result = await fetch("/accounts/profile", {
			headers: { authorization: token },
		});
		if (result.status === 200 && result.data) {
			return result.data.username;
		}
	}
	return null;
};

export const getCurrentUserViaTreaty = async (): Promise<string | null> => {
	if (token) {
		const { data, error } = await treatyApi.accounts.profile.get({
			headers: { authorization: token },
		});
		if (!error) {
			return data.username;
		}
	}
	return null;
};
