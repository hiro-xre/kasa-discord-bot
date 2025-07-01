import { verifiedWebhookRequest, isPingRequest } from "~/utils/interaction";

export default defineEventHandler(async (event) => {
	const publicKey = useRuntimeConfig().discordPublicKey;
	await verifiedWebhookRequest(event, { publicKey });

	// Pingリクエストの場合はPongレスポンスを返す
	if (await isPingRequest(event)) {
		return { type: 1 };
	}

	return "Start by editing <code>server/routes/index.ts</code>.";
});
