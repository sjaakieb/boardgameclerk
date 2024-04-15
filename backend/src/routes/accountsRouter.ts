import { jwt } from "@elysiajs/jwt";
import { Elysia } from "elysia";
import { accountDTO } from "../models/account";
import { UnAuthorizedError } from "../models/errors";
import { getAccount, saveAccount } from "../services/accountsService";

export const accountsRouter = (config: { prefix: string }) =>
	new Elysia({
		name: "accountsRouter",
		seed: config,
	})
		.use(
			jwt({
				name: "jwt",
				secret: "w39o5i23po65ipo2365jk2op",
			}),
		)
		.post(
			`${config.prefix}/register`,
			async ({ body, set }) => {
				await saveAccount(body);
				set.status = 200;
				return "ok";
			},
			{
				body: accountDTO,
			},
		)
		.post(
			`${config.prefix}/login`,
			async ({ jwt, body, cookie: { auth }, set }) => {
				set.headers["Content-Type"] = "application/json";
				const account = await getAccount(body.username);
				if (!account || account.password !== body.password) {
					set.status = 401;
					return {
						reason: "username/password incorrect",
					};
				}
				const token = await jwt.sign({ username: account.username });
				return {
					username: account.username,
					token,
				};
			},
			{ body: accountDTO },
		)
		.get(
			`${config.prefix}/profile`,
			async ({ jwt, set, headers: { authorization } }) => {
				set.headers["Content-Type"] = "application/json";
				const profile = await jwt.verify(authorization);
				const account = await getAccount(profile.username);

				console.log("Account", account);
				if (!account) {
					throw new UnAuthorizedError();
				}

				return {
					username: account.username,
				};
			},
		);
