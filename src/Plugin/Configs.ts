const Configs = {
	PluginName: "UI Labs",
	IconsSprite: "rbxassetid://14105481154",
	Extensions: {
		Story: ".story",
		StoryBook: ".storybook",
		StoryFolder: ".storyfolder",
		Settings: ".uilabs",
	},
	//This is where the plugin will search for stories/storybooks and anything user-created instances
	SearchServices: identity<(keyof Services)[]>([
		"Workspace",
		"ReplicatedFirst",
		"ReplicatedStorage",
		"ServerScriptService",
		"ServerStorage",
		"StarterGui",
		"StarterPlayer",
	]),
	UIDAttributeName: "__uilabs_uid",
	HotReloadTag: "__hotreloaded",
	PluginIconOffset: new Vector2(0, 64),
	PluginIconSize: new Vector2(128, 128),
	PluginIcon: "rbxassetid://112233",
	DefaultHierarchy: identity<PluginHierarchy>([
		{
			DisplayName: "Folder",
			Inside: [
				{
					DisplayName: "Subfolder",
					Inside: [
						{
							DisplayName: "Plugin",
							UID: "{5AA55402-A905-4CB9-8FB9-FC87634C771B}",
						},
						{
							DisplayName: "Sidebar",
							UID: "{DDDB3CD1-AA27-40E7-A8F1-0B94F2DE0725}",
						},
					],
				},
				{
					DisplayName: "IconButton",
					UID: "{17EAA4AD-82DC-4BE9-882E-18FADDAC0E30}",
				},
			],
		},
	]),
};

export = Configs;
