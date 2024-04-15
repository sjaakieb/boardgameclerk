import type { Account } from "./account";

export const Games = ["Diamant", "Monopoly"] as const;

export type ActiveGame = {
	game: (typeof Games)[number];
	creator: Account["username"];
	createdDate: Date;
	participants: Account["username"][];
	code: string;
};
