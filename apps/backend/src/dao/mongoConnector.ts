import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017");
const database = client.db("boardgameclerk");

const accounts = database.collection("accounts");
await accounts.createIndex({ username: 1 }, { unique: true });

export async function getConnection(collectionName: string) {
	return database.collection(collectionName);
}

export async function closeConnection() {
	return client.close();
}
