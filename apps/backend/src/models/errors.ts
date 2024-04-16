export class DuplicationError extends Error {
	constructor(
		public entity: string,
		public id: string,
	) {
		super();
	}
}

export class UnAuthorizedError extends Error {}
