-- the shared fields are repeated instead of intersected with a base,
-- the type tag of a table literal is not inferred through an intersection

export type BooleanSetting = {
	type: "boolean",
	--- unique across every category, the value is stored under it
	key: string,
	name: string,
	description: string,
	default: boolean,
}

export type NumberSetting = {
	type: "number",
	key: string,
	name: string,
	description: string,
	default: number,
	min: number?,
	max: number?,
	step: number?,
	--- shown after the number, like "px"
	unit: string?,
}

export type StringSetting = {
	type: "string",
	key: string,
	name: string,
	description: string,
	default: string,
	placeholder: string?,
}

export type Setting = BooleanSetting | NumberSetting | StringSetting

export type Category = {
	key: string,
	name: string,
	settings: { Setting },
}

-- placeholders, none of these are read anywhere yet.
-- categories and settings show up in the order they are listed
local SETTINGS_CONFIG: { Category } = {
	{
		key = "general",
		name = "General",
		settings = {
			{
				type = "string",
				key = "plugin_name",
				name = "Plugin Name",
				description = "Name displayed in the plugin toolbar",
				default = "UI Labs",
				placeholder = "Plugin Name...",
			},
			{
				type = "boolean",
				key = "hot_reload",
				name = "Hot Reload",
				description = "Reload stories when any of their modules change",
				default = true,
			},
			{
				type = "number",
				key = "reload_delay",
				name = "Reload Delay",
				description = "Time to wait after a change before reloading",
				default = 0.2,
				min = 0,
				max = 5,
				step = 0.05,
				unit = "s",
			},
			{
				type = "boolean",
				key = "restore_session",
				name = "Restore Session",
				description = "Mount the stories that were open when the plugin closed",
				default = false,
			},
			{
				type = "string",
				key = "story_suffix",
				name = "Story Suffix",
				description = "Modules ending with this are listed as stories",
				default = ".story",
			},
			{
				type = "string",
				key = "storybook_suffix",
				name = "Storybook Suffix",
				description = "Modules ending with this are listed as storybooks",
				default = ".storybook",
			},
		},
	},
	{
		key = "display",
		name = "Display",
		settings = {
			{
				type = "number",
				key = "interface_scale",
				name = "Interface Scale",
				description = "Size of the plugin interface",
				default = 100,
				min = 50,
				max = 200,
				step = 5,
				unit = "%",
			},
			{
				type = "boolean",
				key = "animations",
				name = "Animations",
				description = "Animate the interface, turn off to reduce motion",
				default = true,
			},
			{
				type = "boolean",
				key = "hover_hints",
				name = "Hover Hints",
				description = "Show a hint when hovering a button",
				default = true,
			},
			{
				type = "number",
				key = "side_panel_width",
				name = "Side Panel Width",
				description = "Starting width of the explorer panel",
				default = 250,
				min = 150,
				max = 600,
				step = 1,
				unit = "px",
			},
			{
				type = "boolean",
				key = "compact_explorer",
				name = "Compact Explorer",
				description = "Use less spacing between the explorer nodes",
				default = false,
			},
		},
	},
	{
		key = "view",
		name = "View",
		settings = {
			{
				type = "number",
				key = "default_zoom",
				name = "Default Zoom",
				description = "Zoom a story starts with when mounted",
				default = 100,
				min = 10,
				max = 500,
				step = 1,
				unit = "%",
			},
			{
				type = "number",
				key = "zoom_step",
				name = "Zoom Step",
				description = "How much the zoom buttons change the zoom",
				default = 10,
				min = 1,
				max = 100,
				step = 1,
				unit = "%",
			},
			{
				type = "boolean",
				key = "background_pattern",
				name = "Background Pattern",
				description = "Show the pattern behind the stories",
				default = true,
			},
			{
				type = "boolean",
				key = "clip_stories",
				name = "Clip Stories",
				description = "Hide the parts of a story that leave the view",
				default = true,
			},
			{
				type = "number",
				key = "view_padding",
				name = "View Padding",
				description = "Space between the story and the view edges",
				default = 0,
				min = 0,
				max = 100,
				step = 1,
				unit = "px",
			},
		},
	},
	{
		key = "preferences",
		name = "Preferences",
		settings = {
			{
				type = "boolean",
				key = "open_actions_panel",
				name = "Open Actions Panel",
				description = "Open the panel when a story has controls or a summary",
				default = true,
			},
			{
				type = "number",
				key = "actions_panel_height",
				name = "Actions Panel Height",
				description = "Starting height of the actions panel",
				default = 260,
				min = 110,
				max = 800,
				step = 1,
				unit = "px",
			},
			{
				type = "boolean",
				key = "keep_controls",
				name = "Keep Controls",
				description = "Keep the control values when a story reloads",
				default = true,
			},
			{
				type = "boolean",
				key = "pin_new_tabs",
				name = "Pin New Tabs",
				description = "Previews are pinned as soon as they are mounted",
				default = false,
			},
			{
				type = "number",
				key = "max_tabs",
				name = "Maximum Tabs",
				description = "The oldest unpinned preview closes past this amount",
				default = 12,
				min = 1,
				max = 50,
				step = 1,
			},
		},
	},
	{
		key = "advanced",
		name = "Advanced",
		settings = {
			{
				type = "boolean",
				key = "developer_mode",
				name = "Developer Mode",
				description = "Enable advanced developer features",
				default = false,
			},
			{
				type = "boolean",
				key = "beta_features",
				name = "Beta Features",
				description = "Access experimental features",
				default = false,
			},
			{
				type = "boolean",
				key = "shared_environments",
				name = "Shared Environments",
				description = "Stories of a storybook share their required modules",
				default = true,
			},
			{
				type = "number",
				key = "load_timeout",
				name = "Load Timeout",
				description = "A story that takes longer than this to load is cancelled",
				default = 10,
				min = 1,
				max = 120,
				step = 1,
				unit = "s",
			},
			{
				type = "string",
				key = "log_prefix",
				name = "Log Prefix",
				description = "Added before everything the plugin prints",
				default = "[UI Labs]",
			},
		},
	},
}

return SETTINGS_CONFIG
