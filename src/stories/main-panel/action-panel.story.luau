local use_theme = require "@contexts/theme/use-theme"
local ui_labs = require "@pkg/ui-labs"
local vide = require "@pkg/vide"
local themes = require "@themes"
local resizable_panel = require "@ui/holders/resizable-panel"
local action_panel = require "@ui/main-panel/action-panel"
local boolean_control = require "@ui/main-panel/control-rendering/primitive/boolean"
local string_control = require "@ui/main-panel/control-rendering/primitive/string"
local click_detector = require "@ui/styles/click-detector"
local corner = require "@ui/styles/corner"
local frame = require "@ui/styles/frame"
local top_list = require "@ui/styles/list/top-list"
local padding = require "@ui/styles/padding"
local scroller = require "@ui/styles/scroller"
local text = require "@ui/styles/text"
local derivers = require "@utils/vide/derivers"

vide.strict = false

local PANEL_SIZE = 260

local SUMMARY = "This is a <b>summary</b>, stories describe themselves here.\n\n"
	.. "It wraps to the panel width and scrolls when it does not fit, resize the panel "
	.. "from its top edge to try it. Dragging it below the threshold collapses it, the "
	.. "same thing the close button does."

-- long enough to overflow the panel, the content has to scroll under the header
local FILLER_ROWS = 14

return ui_labs.CreateVideStory({ vide = vide }, function(props)
	local theme = use_theme()

	local panel_size = vide.source(PANEL_SIZE)
	local collapsed = vide.source(false)

	-- what the selected story would offer, the app reads these from the world
	local has_summary = vide.source(true)
	local has_controls = vide.source(true)
	local available = function()
		return has_summary() or has_controls()
	end

	local enabled = vide.source(true)
	local label = vide.source "hello"

	local function button(
		name: string,
		order: number,
		label_text: Derivable<string>,
		activated: () -> (),
		visible: Reactive<boolean>?
	)
		return frame {
			Name = name,
			Size = UDim2.new(1, 0, 0, 30),
			BackgroundColor3 = theme(themes.background4),
			LayoutOrder = order,
			Visible = visible,

			corner { radius = 8 },
			text {
				Text = label_text,
				Size = UDim2.fromScale(1, 1),
			},
			click_detector {
				Activated = activated,
			},
		}
	end

	local function section(name: string, order: number)
		return text {
			Name = name,
			Text = name,
			TextColor3 = theme(themes.text2),
			TextXAlignment = Enum.TextXAlignment.Left,
			Size = UDim2.new(1, 0, 0, 20),
			LayoutOrder = order,
		}
	end

	-- the real tabs read the selected preview, these are fakes to exercise the panel alone
	local tabs: { action_panel.ActionTab } = {
		{
			key = "summary",
			name = "Summary",
			visible = has_summary,
			render = function()
				return scroller {
					padding { paddingx = 12, paddingy = 10 },
					text {
						Text = SUMMARY,
						RichText = true,
						TextWrapped = true,
						TextColor3 = theme(themes.text2),
						TextXAlignment = Enum.TextXAlignment.Left,
						TextYAlignment = Enum.TextYAlignment.Top,
						AutomaticSize = Enum.AutomaticSize.Y,
						Size = UDim2.fromScale(1, 0),
					},
				}
			end,
		},
		{
			key = "controls",
			name = "Controls",
			visible = has_controls,
			render = function()
				return scroller {
					padding { paddingx = 12, paddingy = 8 },
					top_list { gap = 4 },

					section("enabled", 1),
					boolean_control {
						name = "enabled",
						control = {},
						order = 2,
						value = enabled,
						apply = enabled,
						reset = function()
							enabled(true)
						end,
					},
					section("label", 3),
					string_control {
						name = "label",
						control = { MultiLine = false },
						order = 4,
						value = label,
						apply = label,
						reset = function()
							label "hello"
						end,
					},
				}
			end,
		},
		{
			key = "overflow",
			name = "A longer tab name",
			-- goes with the controls, so turning both off leaves the panel with nothing to show
			visible = has_controls,
			render = function()
				local rows = {}
				for index = 1, FILLER_ROWS do
					rows[index] = section(`row {index}`, index)
				end

				return scroller {
					padding { paddingx = 12, paddingy = 8 },
					top_list { gap = 4 },

					rows,
				}
			end,
		},
	}

	return frame {
		Name = "canvas",
		BackgroundColor3 = theme(themes.background1),

		frame {
			Name = "buttons",
			AnchorPoint = Vector2.new(0.5, 0),
			Position = UDim2.new(0.5, 0, 0, 40),
			Size = UDim2.fromOffset(170, 0),
			AutomaticSize = Enum.AutomaticSize.Y,
			BackgroundTransparency = 1,

			top_list { gap = 6 },
			button("summary", 1, derivers.boolean(has_summary, "Summary: on", "Summary: off"), function()
				has_summary(not has_summary())
			end),
			button("controls", 2, derivers.boolean(has_controls, "Controls: on", "Controls: off"), function()
				has_controls(not has_controls())
			end),
			-- the app has no reopen button yet, without this a closed panel only comes back by dragging
			button("reopen", 3, "Open panel", function()
				-- growing past the uncollapse threshold is what reopens it
				panel_size(PANEL_SIZE)
			end, collapsed),
		},
		text {
			Name = "state",
			Text = function()
				return if not available() then "hidden, nothing to show" elseif collapsed() then "closed" else "open"
			end,
			TextColor3 = theme(themes.text3),
			AutomaticSize = Enum.AutomaticSize.XY,
			Size = UDim2.fromOffset(0, 0),
			Position = UDim2.fromOffset(12, 10),
		},

		resizable_panel {
			Name = "action_panel_holder",
			panel_size = panel_size,
			handle_axis = "top",
			minimum_size = 110,
			collapse_threshold = 50,
			uncollapse_threshold = 70,
			collapsed = collapsed,
			panel_native = {
				AnchorPoint = Vector2.new(0, 1),
				Position = UDim2.fromScale(0, 1),
				-- same as the main panel, nothing to show hides it with its resize handle
				Visible = available,
			},

			children = action_panel {
				tabs = tabs,
				closed = function()
					collapsed(true)
				end,
			},
		},
	}
end)
