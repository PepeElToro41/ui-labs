local app_render_provider = require "@contexts/app-render/app-render-provider"
local use_popup = require "@contexts/app-render/use-popup"
local ui_labs = require "@pkg/ui-labs"
local vide = require "@pkg/vide"
local dropdown = require "@ui/overlays/dropdown"
local dropdown_divider = require "@ui/overlays/dropdown/divider"
local dropdown_item = require "@ui/overlays/dropdown/item"
local dropdown_popup = require "@ui/overlays/dropdown/popup"
local click_detector = require "@ui/styles/click-detector"
local div = require "@ui/styles/div"
local top_list = require "@ui/styles/list/top-list"
local text = require "@ui/styles/text"

vide.strict = false

local SUBMENU_ICON = "rbxassetid://98515959792894"

return ui_labs.CreateVideStory({ vide = vide }, function(props)
	local last_clicked = vide.source "nothing"

	local function item(order: number, label: string, extra: { shortcut: string?, icon: string?, disabled: boolean? }?)
		return dropdown_item {
			order = order,
			text = label,
			shortcut = extra and extra.shortcut,
			icon = extra and extra.icon,
			disabled = extra and extra.disabled,
			activated = function()
				last_clicked(label)
			end,
		}
	end

	local function items()
		return {
			item(1, "Edit", { shortcut = "Ctrl + T" }),
			item(2, "Controls"),
			dropdown_divider { order = 3 },
			item(4, "Unmount All", { disabled = true }),
			item(5, "Mount On Top"),
			dropdown_divider { order = 6 },
			item(7, "Test", { icon = SUBMENU_ICON }),
		}
	end

	-- the static dropdown shows the visuals, right clicking anywhere opens the same
	-- items as a popup at the cursor so wrapping can be tested against every edge
	return app_render_provider {
		children = function()
			local popup = use_popup()

			return div {
				click_detector {
					MouseButton2Up = function(x: number, y: number)
						popup.open(function()
							return dropdown_popup {
								position = Vector2.new(x, y),
								children = items(),
							}
						end)
					end,
				},
				div {
					AnchorPoint = Vector2.new(0.5, 0.5),
					Position = UDim2.fromScale(0.5, 0.5),
					Size = UDim2.fromOffset(215, 0),
					AutomaticSize = Enum.AutomaticSize.Y,

					top_list { gap = 12 },
					dropdown {
						native = {
							LayoutOrder = 1,
						},
						children = items(),
					},
					text {
						LayoutOrder = 2,
						Size = UDim2.new(1, 0, 0, 20),
						TextColor3 = Color3.fromRGB(180, 180, 180),
						TextSize = 12,
						Text = function()
							return `last clicked: {last_clicked()}`
						end,
					},
					text {
						LayoutOrder = 3,
						Size = UDim2.new(1, 0, 0, 20),
						TextColor3 = Color3.fromRGB(180, 180, 180),
						TextSize = 12,
						Text = "right click anywhere to open a popup",
					},
				},
			}
		end,
	}
end)
