import { NotFoundError } from "elysia";
import { v4 as uuidv4 } from "uuid";
import type { Account } from "../models/account";
import { DuplicationError } from "../models/errors";
import type { ActiveGame } from "../models/game";

const activeGames: ActiveGame[] = [];

export function createGameSession(game: ActiveGame) {
	while (activeGames.some((g) => g.code === game.code)) {
		game.code = uuidv4();
	}
	activeGames.push(game);
}

export function joinGameSession(code: ActiveGame["code"], account: Account) {
	const game = activeGames.find((g) => g.code === code);
	if (!game) {
		throw new NotFoundError();
	}
	if (game.participants.some((p) => p === account.username)) {
		throw new DuplicationError();
	}
	game.participants.push(account.username);
}

export function getUserGames(account: Account) {
	return activeGames.filter((g) => g.participants.includes(account.username));
}
