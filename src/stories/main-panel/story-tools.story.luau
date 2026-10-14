local app_render_provider = require "@contexts/app-render/app-render-provider"
local use_theme = require "@contexts/theme/use-theme"
local ui_labs = require "@pkg/ui-labs"
local vide = require "@pkg/vide"
local themes = require "@themes"
local element_selection = require "@ui/main-panel/story-content/tools/element-selection"
local measure_tool = require "@ui/main-panel/story-content/tools/measure-tool"
local outline_marker = require "@ui/main-panel/story-content/tools/outline-marker"
local click_detector = require "@ui/styles/click-detector"
local corner = require "@ui/styles/corner"
local div = require "@ui/styles/div"
local frame = require "@ui/styles/frame"
local top_list = require "@ui/styles/list/top-list"
local padding = require "@ui/styles/padding"
local scroller = require "@ui/styles/scroller"
local text = require "@ui/styles/text"
local actions = require "@utils/vide/actions"
local derivers = require "@utils/vide/derivers"
local videx = require "@utils/vide/videx"

vide.strict = false

-- rows of the clipping list, more than it can show: the ones scrolled out of it are not
-- outlined and cannot be selected, the ones at its edge only up to where they are drawn
local CLIPPED_ROWS = 8

--- Stands in for a mounted story: the tools are pointed at this frame and look at whatever is
--- under it, the same way they look at the holder of a preview in the app
local function fake_story(props: { root: Source<Frame?> })
	local theme = use_theme()

	local function label(name: string, order: number)
		return text {
			Name = name,
			Text = name,
			TextColor3 = theme(themes.text2),
			Size = UDim2.new(1, 0, 0, 22),
			LayoutOrder = order,
		}
	end

	return div {
		Name = "story",

		vide.action(props.root),

		frame {
			Name = "panel",
			Position = UDim2.fromOffset(60, 50),
			Size = UDim2.fromOffset(260, 210),
			BackgroundColor3 = theme(themes.background3),

			corner {},
			-- covers its parent completely, so it is never outlined: its outline would only
			-- double the one of the panel
			div {
				Name = "fill",

				padding { padding = 10 },
				top_list { gap = 6 },

				label("first", 1),
				label("second", 2),
				-- never outlined nor selected, and neither is anything under it
				div {
					Name = "hidden",
					Visible = false,
					Size = UDim2.new(1, 0, 0, 22),
					LayoutOrder = 3,

					label("under a hidden frame", 1),
				},
				frame {
					Name = "clipping",
					Size = UDim2.new(1, 0, 0, 90),
					BackgroundColor3 = theme(themes.background2),
					ClipsDescendants = true,
					LayoutOrder = 4,

					corner { radius = 6 },
					scroller {
						padding { paddingx = 8, paddingy = 6 },
						top_list { gap = 4 },

						(function()
							local rows = {}
							for index = 1, CLIPPED_ROWS do
								rows[index] = label(`row {index}`, index)
							end
							return rows
						end)(),
					},
				},
			},
		},
		-- two siblings that share a ZIndex and one that does not: the draw order of the
		-- overlap is what the element selection marks, the last one is always on top
		frame {
			Name = "under",
			Position = UDim2.fromOffset(360, 80),
			Size = UDim2.fromOffset(120, 120),
			BackgroundColor3 = theme(themes.story),

			corner {},
		},
		frame {
			Name = "over",
			Position = UDim2.fromOffset(410, 130),
			Size = UDim2.fromOffset(120, 120),
			BackgroundColor3 = theme(themes.folder),

			corner {},
		},
		frame {
			Name = "on_top",
			-- drawn over both of them although it comes first in ZIndex order
			ZIndex = 2,
			Position = UDim2.fromOffset(385, 105),
			Size = UDim2.fromOffset(120, 120),
			BackgroundColor3 = theme(themes.storybook),
			BackgroundTransparency = 0.3,

			corner {},
		},
	}
end

return ui_labs.CreateVideStory({ vide = vide }, function(props)
	return videx.provider_stack {
		-- the tools read the app wide inputs, the user input provider shares them
		providers = { app_render_provider },
		children = function()
			local theme = use_theme()

			--- the frame the tools look into, as the preview holder is in the app
			local root = vide.source(nil :: Frame?)
			--- absolute position and size of the overlay, the tools draw absolute positions as
			--- offsets inside it
			local view = actions.shape_source()

			local measure = vide.source(false)
			local select = vide.source(false)
			local outlines = vide.source(false)

			local function button(name: string, order: number, enabled: Source<boolean>)
				return frame {
					Name = name,
					Size = UDim2.new(1, 0, 0, 28),
					BackgroundColor3 = function()
						return if enabled() then theme().emphasis else theme().background4
					end,
					LayoutOrder = order,

					corner { radius = 8 },
					text {
						Text = derivers.boolean(enabled, `{name}: on`, `{name}: off`),
						Size = UDim2.fromScale(1, 1),
					},
					click_detector {
						Activated = function()
							enabled(not enabled())
						end,
					},
				}
			end

			return frame {
				Name = "canvas",
				BackgroundColor3 = theme(themes.background1),

				fake_story { root = root },

				div {
					Name = "story_tools",
					ZIndex = 2,
					ClipsDescendants = true,

					actions.absolute_shape(view),

					videx.show(outlines, function()
						return outline_marker { root = root, view = view }
					end),
					videx.show(select, function()
						return element_selection { root = root, view = view }
					end),
					videx.show(measure, function()
						return measure_tool { view = view }
					end),
				},
				-- over the tools, they take every input of the story area while enabled
				div {
					Name = "buttons",
					ZIndex = 3,
					AnchorPoint = Vector2.new(1, 0),
					Position = UDim2.new(1, -12, 0, 12),
					Size = UDim2.fromOffset(160, 0),
					AutomaticSize = Enum.AutomaticSize.Y,

					top_list { gap = 6 },
					button("measure", 1, measure),
					button("select", 2, select),
					button("outlines", 3, outlines),
				},
			}
		end,
	}
end)
