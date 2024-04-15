import { type Static, t } from "elysia";

export const accountDTO = t.Object({
	username: t.String({ minLength: 3, maxLength: 100 }),
	password: t.String({ minLength: 6, maxLength: 100 }),
});

export type Account = Static<typeof accountDTO>;
