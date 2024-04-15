import type { Document } from "mongodb";

export default class AccountDB implements Document {
	constructor(
		public username: string,
		public password: string,
	) {}
}
