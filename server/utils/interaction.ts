import type { H3Event } from "h3";
import { verifyKey } from "discord-interactions";
import {
	InteractionType,
	type APIChatInputApplicationCommandInteraction,
	type APIPingInteraction,
} from "discord-api-types/v10";

export const isVerified = async (
	event: H3Event,
	{ publicKey },
): Promise<boolean> => {
	const signature = getHeader(event, "X-Signature-Ed25519");
	const timestamp = getHeader(event, "X-Signature-Timestamp");
	const rawBody = await readRawBody(event);

	return verifyKey(rawBody, signature, timestamp, publicKey);
};

export const verifiedWebhookRequest = async (
	event: H3Event,
	{ publicKey },
): Promise<void> => {
	const isRequestVerified = await isVerified(event, { publicKey });

	if (!isRequestVerified) {
		throw createError({
			statusCode: 401,
			statusMessage: "Invalid request signature",
		});
	}
};

export const isPingRequest = async (event: H3Event): Promise<boolean> => {
	const body = await readBody<
		APIPingInteraction | APIChatInputApplicationCommandInteraction
	>(event);

	return body.type === InteractionType.Ping;
};

export const isApplicationCommand = async (
	event: H3Event,
): Promise<boolean> => {
	const body = await readBody<
		APIPingInteraction | APIChatInputApplicationCommandInteraction
	>(event);

	return body.type === InteractionType.ApplicationCommand;
};
