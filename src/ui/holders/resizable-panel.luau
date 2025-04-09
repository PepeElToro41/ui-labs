local Vide = require "@pkg/vide"
local init_source = require("@utils/vide").init_source

local UDimOffset = require("@utils/number").UDimOffset
local actions = require "@actions"

local Div = require "@base/div"
local Frame = require "@base/frame"
local Detector = require "@base/detector"
local DragDetector = require "@base/drag-detector"

type Source<T> = Vide.Source<T>

local source = Vide.source
local untrack = Vide.untrack
local effect = Vide.effect
local cleanup = Vide.cleanup

type ResizablePanelProps = {
	Name: string?,
	HandleThickness: number?,
	HandleAxis: ("Top" | "Bottom" | "Left" | "Right")?,
	Size: Derivable<UDim2>?,
	PanelNative: Vide.vFrame?,
	ContentsNative: Vide.vFrame?,

	PanelSize: number | Source<number>,
	MinimumSize: number?,
	MaximumSize: number?,

	CollapseThreshold: number?,
	UncollapseThreshold: number?,

	Collapsed: Source<boolean>?,

	children: any?,
}

function ResizablePanel(props: ResizablePanelProps)
	local dragging = source(false)
	local hovered = source(false)
	local collapsed: Source<boolean> = props.Collapsed or source(false)
	local panelSize = init_source(props.PanelSize) :: Source<number>

	local detector = source() :: Source<UIDragDetector>

	local handleAnchor = props.HandleAxis or "Right"
	local usesWith = handleAnchor == "Left" or handleAnchor == "Right"
	local handleX = if handleAnchor == "Left" then 0 elseif handleAnchor == "Right" then 1 else 0.5
	local handleY = if handleAnchor == "Top" then 0 elseif handleAnchor == "Bottom" then 1 else 0.5

	local function OffsetUDim2(usesWith: boolean, offset: number, base: UDim2)
		if usesWith then return UDim2.new(0, offset, base.Y.Scale, base.Y.Offset) end
		return UDim2.new(base.X.Scale, base.X.Offset, 0, offset)
	end
	local function ClampedPanelSize()
		return math.clamp(panelSize(), props.MinimumSize or 0, props.MaximumSize or math.huge)
	end

	local function ResetDragging()
		if untrack(collapsed) then
			panelSize(0) -- if collapsed, panel size should reset back to 0
		else
			panelSize(untrack(ClampedPanelSize))
		end
	end

	effect(function()
		local detector = detector()

		cleanup(ResetDragging)
		if not dragging() then return end

		local multiplier = handleX * 2 - 1 + (handleY * 2 - 1)
		local start = UDimOffset(detector.DragUDim2)
		local base = untrack(panelSize)

		cleanup(detector.DragContinue:Connect(function()
			local delta = (UDimOffset(detector.DragUDim2) - start) * multiplier
			panelSize(math.clamp(base + delta, 0, props.MaximumSize or math.huge))
		end))
	end)

	effect(function()
		if props.CollapseThreshold ~= nil then
			if panelSize() < props.CollapseThreshold then collapsed(true) end
		end
		if props.UncollapseThreshold ~= nil then
			if panelSize() >= props.UncollapseThreshold then collapsed(false) end
		end
	end)

	effect(function()
		if collapsed() then panelSize(0) end
	end)

	local computedSize = function()
		if collapsed() then return OffsetUDim2(usesWith, 0, UDim2.fromScale(1, 1)) end
		return OffsetUDim2(usesWith, ClampedPanelSize(), UDim2.fromScale(1, 1))
	end

	return (
		Div {
			Name = props.Name or "ResizablePanel",
			AnchorPoint = Vector2.new(1 - math.floor(handleX), 1 - math.floor(handleY)),
			props.PanelNative,
			{ Size = computedSize },

			Frame {
				Name = "DragAdornee",
				BackgroundColor3 = Color3.fromRGB(56, 165, 255),
				Position = UDim2.fromScale(handleX, handleY),
				AnchorPoint = Vector2.new(usesWith and (1 - handleX) or 0.5, (not usesWith) and (1 - handleY) or 0.5),
				Visible = function()
					return dragging() or hovered()
				end,
				Size = function()
					return OffsetUDim2(usesWith, (dragging() and 2) or 1, UDim2.fromScale(1, 1))
				end,
				ZIndex = 2,
			},
			Detector {
				Position = UDim2.fromScale(handleX, handleY),
				AnchorPoint = Vector2.new(0.5, 0.5),
				Size = OffsetUDim2(usesWith, props.HandleThickness or 10, UDim2.fromScale(1, 1)),
				ZIndex = 2,

				actions.Hovered(hovered),
				DragDetector {
					DragRelativity = Enum.UIDragDetectorDragRelativity.Relative,
					ResponseStyle = Enum.UIDragDetectorResponseStyle.CustomOffset,
					DragStyle = Enum.UIDragDetectorDragStyle.TranslateLine,
					DragAxis = Vector2.new(handleX * 2 - 1, handleY * 2 - 1),
					Dragging = dragging,
					Vide.action(detector),
				},
			},
			Frame {
				Name = "Contents",
				Size = UDim2.fromScale(1, 1),
				Visible = function()
					return not collapsed()
				end,
				props.ContentsNative,
				props.children,
			},
		}
	)
end

return ResizablePanel
