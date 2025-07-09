import {
	verifiedWebhookRequest,
	isPingRequest,
	isApplicationCommand,
} from "~/utils/interaction";
import { getUmbrellaMessage } from "~/utils/weather";

export default defineEventHandler(async (event) => {
	const publicKey = useRuntimeConfig().discordPublicKey;
	await verifiedWebhookRequest(event, { publicKey });

	// Pingリクエストの場合はPongレスポンスを返す
	if (await isPingRequest(event)) {
		return { type: 1 };
	}

	if (!(await isApplicationCommand(event))) {
		throw createError({
			status: 400,
			statusMessage: "Invalid Request",
		});
	}

	const message = await getUmbrellaMessage();

	return {
		type: 4,
		data: { content: message },
	};
});
