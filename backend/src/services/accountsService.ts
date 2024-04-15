import { getAccountFromDB, putAccountInDB } from "../dao/accountsData";
import type { Account } from "../models/account";

const accounts: Account[] = [];

export async function getAccount(
	username: string,
): Promise<{ username: string; password: string } | null> {
	// return accounts.find((a) => a.username === username);
	const result = await getAccountFromDB(username);
	if (result) {
		return {
			username: result.username,
			password: result.password,
		};
	}
	return null;
}

export async function saveAccount(user: Account) {
	// if (accounts.some((a) => a.username === user.username)) {
	//     throw new DuplicationError();
	// }
	// accounts.push(user);
	return putAccountInDB(user);
}
