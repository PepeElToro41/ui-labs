import { defineConfig } from "vitepress";

export const shared = defineConfig({
	title: "UI Labs",
	titleTemplate: ":title - UI Labs",
	base: "/",
	cleanUrls: true,

	rewrites: {
		"en/:rest*": ":rest*"
	},

	head: [
		[
			"link",
			{
				rel: "icon",
				type: "image/x-icon",
				href: "/home/pluginicon.ico"
			}
		],
		[
			"link",
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@600;700&display=swap"
			}
		]
	],

	themeConfig: {
		logo: "/home/pluginicon.ico",
		socialLinks: [{ icon: "github", link: "https://ui-labs.luau.page" }]
	}
});
