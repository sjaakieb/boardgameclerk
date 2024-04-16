import { jwt } from "@elysiajs/jwt";
import { Elysia, t } from "elysia";
import { v4 as uuidv4 } from "uuid";
import type { Account } from "../models/account";
import { UnAuthorizedError } from "../models/errors";
import { getAccount } from "../services/accountsService";
import {
	createGameSession,
	getUserGames,
	joinGameSession,
} from "../services/gamesService";

const Games = ["Diamant", "Monopoly"] as const;

type ActiveGame = {
	game: (typeof Games)[number];
	creator: Account["username"];
	createdDate: Date;
	participants: Account["username"][];
	code: string;
};

const activeGames: ActiveGame[] = [];

export const gamesRouter = (config: { prefix: string }) =>
	new Elysia({
		name: "gamesRouter",
		seed: config,
	})
		.use(
			jwt({
				name: "jwt",
				secret: "w39o5i23po65ipo2365jk2op",
			}),
		)
		.derive(async ({ jwt, cookie: { auth }, set }) => {
			const profile = await jwt.verify(auth.value);
			const account = getAccount(profile.username);

			console.log("Derived Account", account);
			if (!account) {
				throw new UnAuthorizedError();
			}
			return {
				account,
			};
		})
		.post(
			`${config.prefix}/create`,
			async ({ body, account, set }) => {
				const game = Games.find((g) => g === body.game);
				if (!game) {
					set.status = 422;
					return "Unknown game";
				}
				const newGameSession = {
					creator: account.username,
					game,
					createdDate: new Date(),
					participants: [account.username],
					code: uuidv4(),
				};
				createGameSession(newGameSession);
				return "Created Game";
			},
			{
				body: t.Object({ game: t.String() }),
			},
		)
		.post(`${config.prefix}/:id/join`, async ({ params: { id }, account }) => {
			joinGameSession(id, account);
			return "Joined Game";
		})
		.get(`${config.prefix}/`, ({ account, set }) => {
			set.headers["Content-Type"] = "application/json";
			return getUserGames(account);
		});
