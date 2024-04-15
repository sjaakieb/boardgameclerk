import cors from "@elysiajs/cors";
import { Elysia } from "elysia";
import { DuplicationError, UnAuthorizedError } from "./models/errors";
import { accountsRouter } from "./routes/accountsRouter";
import { gamesRouter } from "./routes/gamesRouter";

const app = new Elysia()
	.error({
		DuplicationError,
		UnAuthorizedError,
	})
	.onError(({ code, error, set }) => {
		if (error instanceof DuplicationError) {
			set.status = 409;
			set.headers["Content-Type"] = "text/plain";
			return `${error.entity} ${error.id} is already used`;
		}
		if (error instanceof UnAuthorizedError) {
			set.status = 401;
			set.headers["Content-Type"] = "text/plain";
			return "Not Allowed";
		}
		console.log("CODE", code);
		console.log("ERROR", error);
		throw error;
	})
	.use(cors())
	.use(accountsRouter({ prefix: "accounts" }))
	.use(gamesRouter({ prefix: "games" }))
	.get("/", () => "Hello Elysia")
	.get(
		"/name/:name",
		({ params: { name } }) => `Hello ${name}. Welcome to Elysia`,
	)
	.listen(3000);

export type App = typeof app;

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
