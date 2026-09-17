local CONFIG = require "@constants/config"
local IMAGES = require "@constants/images"
local use_theme = require "@contexts/theme/use-theme"
local use_world = require "@contexts/world/use-world"
local use_component = require "@hooks/use-component"
local use_instance_name = require "@hooks/use-instance-name"
local use_tag = require "@hooks/use-tag"
local vide = require "@pkg/vide"
local c = require "@src/components"
local module_search = require "@src/systems/module-search"
local previews = require "@src/systems/previews"
local themes = require "@themes"
local glow = require "@ui/elements/glow"
local measured_frame = require "@ui/holders/measured-frame"
local click_detector = require "@ui/styles/click-detector"
local corner = require "@ui/styles/corner"
local div = require "@ui/styles/div"
local frame = require "@ui/styles/frame"
local image = require "@ui/styles/image"
local left_list = require "@ui/styles/list/left-list"
local padding = require "@ui/styles/padding"
local text = require "@ui/styles/text"
local actions = require "@utils/vide/actions"
local derivers = require "@utils/vide/derivers"
local ecs = require "@vendor/ecs"

type PreviewTabProps = {
	entity: ecs.Entity,
}

local STORY_SUFFIX = CONFIG.file_extensions.story
local GLOW_EXTENDS = Vector2.new(14, 14)

local function preview_tab(props: PreviewTabProps)
	local world = use_world()
	local theme = use_theme()
	local entity = props.entity

	local hovered = vide.source(false)
	local close_hovered = vide.source(false)

	-- the preview owns a copy of the story module, so the name is read straight from it
	local module = use_component(entity, c.module_script)
	local module_name = use_instance_name(module)
	local order = use_component(entity, c.preview_order)
	local quick = use_tag(entity, c.quick_mounted)
	local selected = use_tag(entity, c.selected_preview)

	local hover_alpha = vide.spring(derivers.boolean(hovered, 1, 0), 0.2, 1)

	local name = function()
		if not module() then
			return "(Deleted)"
		end
		return module_search.remove_extension(module_name(), STORY_SUFFIX)
	end

	local label = function()
		return (if quick() then "• " else "") .. name()
	end

	local text_color = function()
		return theme()[if selected() then themes.text_active1 else themes.text2]
	end

	local function on_selected()
		previews.select(world, entity)
	end

	local function on_closed()
		previews.unmount(world, entity)
	end

	-- the glow and the detector need full size, so the automatic sizing lives in the inner frame
	return measured_frame {
		outer_children = {
			glow {
				name = "hover_glow",
				extends = GLOW_EXTENDS,
				blur = 0.8,
				color = theme(themes.emphasis),
				transparency = derivers.lerp(hover_alpha, 1, 0),
			},
			click_detector {
				-- below the measured frame so the close button receives its own clicks
				ZIndex = 0,
				Activated = on_selected,
				actions.hovered(hovered),
			},
		} :: Array<Instance>,
		native = {
			Name = name,
			AutomaticSize = Enum.AutomaticSize.X,
			Size = UDim2.fromScale(0, 1),
			-- measured_frame renders native inside a div, so the transparency must be forced
			BackgroundTransparency = 0,
			BackgroundColor3 = function()
				return theme()[if selected() then themes.emphasis else themes.background3]
			end,
			LayoutOrder = function()
				return order() or 0
			end,

			corner {
				radius = 8,
			},
			vide.create "UIStroke" {
				Thickness = 1,
				Transparency = derivers.lerp(hover_alpha, 0.8, 0.5),
				Color = function()
					return theme().border:Lerp(theme().emphasis, hover_alpha())
				end,
			},
			div {
				Name = "holder",
				AutomaticSize = Enum.AutomaticSize.X,
				Size = UDim2.fromScale(0, 1),

				padding {
					paddingx = 8,
				},
				left_list {
					VerticalAlignment = Enum.VerticalAlignment.Center,
					gap = 5,
				},
				text {
					Name = "label",
					Text = label,
					TextColor3 = text_color,
					TextXAlignment = Enum.TextXAlignment.Left,
					AutomaticSize = Enum.AutomaticSize.X,
					Size = UDim2.fromScale(0, 1),
					LayoutOrder = 1,
				},
				frame {
					Name = "close",
					Size = UDim2.fromOffset(17, 17),
					LayoutOrder = 2,
					BackgroundColor3 = function()
						return theme()[if selected() then themes.emphasis2 else themes.background5]
					end,
					BackgroundTransparency = derivers.boolean(close_hovered, 0.3, 1),

					corner {
						radius = 6,
					},
					image {
						Name = "icon",
						Image = IMAGES.close,
						ImageColor3 = text_color,
						ScaleType = Enum.ScaleType.Fit,
						Size = UDim2.fromOffset(13, 13),
						Position = UDim2.fromScale(0.5, 0.5),
						AnchorPoint = Vector2.new(0.5, 0.5),
					},
					click_detector {
						Activated = on_closed,
						actions.hovered(close_hovered),
					},
				},
			},
		},
	}
end

return preview_tab
