import { MongoClient, MongoServerError, type WithId } from "mongodb";
import type { Account } from "../models/account";
import { DuplicationError } from "../models/errors";
import type AccountDB from "../models/mongo/accountDB";
import { closeConnection, getConnection } from "./mongoConnector";

export async function getAccountFromDB(
	username: string,
): Promise<WithId<AccountDB> | null> {
	try {
		const client = new MongoClient("mongodb://localhost:27017");
		const database = client.db("boardgameclerk");
		const accounts = database.collection("accounts");
		// Query for a movie that has the title 'Back to the Future'
		const account = await accounts.findOne({ username });
		if (account) {
			return account as WithId<AccountDB>;
		}
		return account;
	} finally {
		// Ensures that the client will close when you finish/error
		await closeConnection();
	}
}

export async function putAccountInDB(user: Account) {
	try {
		const accounts = await getConnection("accounts");
		// Query for a movie that has the title 'Back to the Future'
		await accounts.insertOne(user);
	} catch (e) {
		if (e instanceof MongoServerError && e.code === 11000) {
			throw new DuplicationError("Account", user.username);
		}
		console.error("ERROR", e);
		throw e;
		// } finally {
		//     // Ensures that the client will close when you finish/error
		//     await client.close();
	} finally {
		await closeConnection();
	}
}
