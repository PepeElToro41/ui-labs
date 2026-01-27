local vide = require "@pkg/vide"
local click_detector = require "@ui/styles/click-detector"
local div = require "@ui/styles/div"
local drag_detector = require "@ui/styles/drag-detector"
local frame = require "@ui/styles/frame"
local conversion = require "@utils/conversion"
local actions = require "@utils/vide/actions"
local videx = require "@utils/vide/videx"

type ResizablePanelProps = {
	Name: string?,
	handle_thickness: number?,
	handle_axis: ("top" | "bottom" | "left" | "right")?,
	size: Derivable<UDim2>?,
	panel_native: vide.vFrame?,
	contents_native: vide.vFrame?,

	panel_size: number | Source<number>,
	minimum_size: number?,
	maximum_size: number?,

	collapse_threshold: number?,
	uncollapse_threshold: number?,

	collapsed: Source<boolean>?,

	children: any?,
}

local function resizable_panel(props: ResizablePanelProps)
	local dragging = vide.source(false)
	local hovered = vide.source(false)
	local current_detector = vide.source() :: Source<UIDragDetector>
	local panel_size = videx.source_from(props.panel_size) :: Source<number>
	local collapsed: Source<boolean> = props.collapsed or vide.source(false)

	local handle_anchor = props.handle_axis or "right"
	local uses_width = handle_anchor == "left" or handle_anchor == "right"
	local handlex = if handle_anchor == "left" then 0 elseif handle_anchor == "right" then 1 else 0.5
	local handley = if handle_anchor == "top" then 0 elseif handle_anchor == "bottom" then 1 else 0.5

	local function offset_udim2(uses_width: boolean, offset: number, base: UDim2)
		if uses_width then
			return UDim2.new(0, offset, base.Y.Scale, base.Y.Offset)
		end
		return UDim2.new(base.X.Scale, base.X.Offset, 0, offset)
	end

	local function clamped_panel_size()
		return math.clamp(panel_size(), props.minimum_size or 0, props.maximum_size or math.huge)
	end

	local function reset_dragging()
		if vide.untrack(collapsed) then
			-- if collapsed, panel size should reset back to 0
			panel_size(0)
		else
			panel_size(vide.untrack(clamped_panel_size))
		end
	end

	vide.effect(function()
		local current_detector = current_detector()

		vide.cleanup(reset_dragging)
		if not dragging() then
			return
		end

		local multiplier = handlex * 2 - 1 + (handley * 2 - 1)
		local start = conversion.udim_offset(current_detector.DragUDim2)
		local base = vide.untrack(panel_size)

		vide.cleanup(current_detector.DragContinue:Connect(function()
			local delta = (conversion.udim_offset(current_detector.DragUDim2) - start) * multiplier
			panel_size(math.clamp(base + delta, 0, props.maximum_size or math.huge))
		end))
	end)

	vide.effect(function()
		if props.collapse_threshold ~= nil then
			if panel_size() < props.collapse_threshold then
				collapsed(true)
			end
		end
		if props.uncollapse_threshold ~= nil then
			if panel_size() >= props.uncollapse_threshold then
				collapsed(false)
			end
		end
	end)

	vide.effect(function()
		if collapsed() then
			panel_size(0)
		end
	end)

	local computed_size = function()
		if collapsed() then
			return offset_udim2(uses_width, 0, UDim2.fromScale(1, 1))
		end
		return offset_udim2(uses_width, clamped_panel_size(), UDim2.fromScale(1, 1))
	end

	return (
		div {
			Name = props.Name or "ResizablePanel",
			AnchorPoint = Vector2.new(1 - math.floor(handlex), 1 - math.floor(handley)),

			props.panel_native or {},
			{ Size = computed_size },

			frame {
				Name = "DragAdornee",
				BackgroundColor3 = Color3.fromRGB(56, 165, 255),
				Position = UDim2.fromScale(handlex, handley),
				AnchorPoint = Vector2.new(
					uses_width and (1 - handlex) or 0.5,
					(not uses_width) and (1 - handley) or 0.5
				),
				Visible = function()
					return dragging() or hovered()
				end,
				Size = function()
					return offset_udim2(uses_width, (dragging() and 2) or 1, UDim2.fromScale(1, 1))
				end,
				ZIndex = 2,
			},
			click_detector {
				Position = UDim2.fromScale(handlex, handley),
				AnchorPoint = Vector2.new(0.5, 0.5),
				Size = offset_udim2(uses_width, props.handle_thickness or 10, UDim2.fromScale(1, 1)),
				ZIndex = 2,

				actions.hovered(hovered),
				drag_detector {
					DragRelativity = Enum.UIDragDetectorDragRelativity.Relative,
					ResponseStyle = Enum.UIDragDetectorResponseStyle.CustomOffset,
					DragStyle = Enum.UIDragDetectorDragStyle.TranslateLine,
					DragAxis = Vector2.new(handlex * 2 - 1, handley * 2 - 1),

					actions.dragging(dragging),
					vide.action(current_detector),
				},
			},
			frame {
				Name = "Contents",
				Size = UDim2.fromScale(1, 1),
				Visible = function()
					return not collapsed()
				end,

				props.contents_native or {},
				props.children or {},
			},
		}
	)
end

return resizable_panel
