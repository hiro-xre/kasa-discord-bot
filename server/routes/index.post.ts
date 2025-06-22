import { verifiedWebhookRequest } from "~/utils/interaction";

export default defineEventHandler(async (event) => {
	const publicKey = useRuntimeConfig().discordPublicKey;
	await verifiedWebhookRequest(event, { publicKey });

	return "Start by editing <code>server/routes/index.ts</code>.";
});
