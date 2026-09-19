local app_render_provider = require "@contexts/app-render/app-render-provider"
local use_theme = require "@contexts/theme/use-theme"
local use_world = require "@contexts/world/use-world"
local world_provider = require "@contexts/world/world-provider"
local ui_labs = require "@pkg/ui-labs"
local vide = require "@pkg/vide"
local c = require "@src/components"
local controls = require "@src/systems/controls"
local themes = require "@themes"
local control_rendering = require "@ui/main-panel/control-rendering"
local frame = require "@ui/styles/frame"
local text = require "@ui/styles/text"
local videx = require "@utils/vide/videx"

vide.strict = false

local PANEL_HEIGHT = 320

-- every renderer, explicit ordering, a group and a type with no renderer yet
local STORY_CONTROLS: Map<string, unknown> = {
	-- ordered ones come first whatever their name
	zeta = ui_labs.Ordered(ui_labs.String "ordered first", 1),
	alpha = ui_labs.Ordered(ui_labs.Boolean(true), 2),

	text = "grows while focused",
	count = ui_labs.Number(3, 0, 20, 1),
	enabled = false,
	amount = ui_labs.Slider(5, 0, 10, 1),
	target = ui_labs.Object "GuiObject",
	["a very long control name that has to truncate"] = 10,
	color = Color3.fromRGB(180, 133, 255),
	-- no renderer for this type yet, it takes the placeholder row
	choice = ui_labs.Choose { "first", "second", "third" },

	size = ui_labs.ControlGroup {
		width = 120,
		height = 40,
		visible = true,
	},
}

local function describe(values: controls.Values, prefix: string, lines: { string })
	local names = {}
	for name in values do
		table.insert(names, name)
	end
	table.sort(names)

	for _, name in names do
		local value = values[name]
		if type(value) == "table" then
			describe(value :: controls.Values, `{prefix}{name}.`, lines)
		else
			table.insert(lines, `{prefix}{name} = {tostring(value)}`)
		end
	end
end

return ui_labs.CreateVideStory({ vide = vide }, function(props)
	return videx.provider_stack {
		-- the color control opens its picker in the app overlay
		providers = { world_provider, app_render_provider },
		children = function()
			local world = use_world()
			local theme = use_theme()

			-- a fake preview carrying only its controls, nothing gets mounted
			local preview = world.entity()
			world.add(preview, c.story_preview)
			-- previews start with it, the header button toggles it
			world.add(preview, c.keep_controls)
			controls.create(world, preview, controls.convert(STORY_CONTROLS, "[control-rendering story]"))

			-- what a mounter would hand to the story, proves the inputs write to the world
			local values = vide.source ""
			local function update_values()
				local lines = {}
				describe(controls.values(world, preview), "", lines)
				values(table.concat(lines, "\n"))
			end
			vide.cleanup(world.changed(c.control_value, function()
				-- the hook runs mid write, the read waits for it to land
				task.defer(update_values)
			end))
			update_values()

			return frame {
				Name = "canvas",
				BackgroundColor3 = theme(themes.background1),

				text {
					Name = "values",
					Text = values,
					TextColor3 = theme(themes.text2),
					TextSize = 13,
					TextXAlignment = Enum.TextXAlignment.Left,
					TextYAlignment = Enum.TextYAlignment.Top,
					AutomaticSize = Enum.AutomaticSize.XY,
					Size = UDim2.fromOffset(0, 0),
					Position = UDim2.fromOffset(12, 10),
				},
				frame {
					Name = "panel",
					AnchorPoint = Vector2.new(0, 1),
					Position = UDim2.fromScale(0, 1),
					Size = UDim2.new(1, 0, 0, PANEL_HEIGHT),
					BackgroundColor3 = theme(themes.background3),

					control_rendering { entity = preview },
				},
			}
		end,
	}
end)
