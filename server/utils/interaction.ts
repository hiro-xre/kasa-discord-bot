import type { H3Event } from "h3";
import { verifyKey } from "discord-interactions";

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
