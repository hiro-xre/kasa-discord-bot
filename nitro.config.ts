//https://nitro.unjs.io/config
export default defineNitroConfig({
	srcDir: "server",
	runtimeConfig: {
		discordPublicKey: process.env.DISCORD_PUBLIC_KEY,
	},
});
