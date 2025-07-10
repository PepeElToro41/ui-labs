local Vide = require "@pkg/vide"
local useTheme = require("@contexts/theme").useTheme
local connect = require("@utils/vide").connect
local useOverlayHolder = require("@contexts/app-render/overlay-holder").useOverlayHolder
local Shape = require("@actions").Shape

local changed = Vide.changed
local source = Vide.source
local effect = Vide.effect
--local read = Vide.read
local derive = Vide.derive
local untrack = Vide.untrack
local action = Vide.action

local Div = require "@base/div"
local Frame = require "@base/frame"
local Scroller = require "@base/scroller"
local Padding = require "@base/padding"

type OverlayHolderProps = {
	HolderNative: Vide.vFrame,
	Padding: Derivable<number>?,
	AnchorPosition: Derivable<Vector2 | GuiObject>,
	AnchorSize: Derivable<(Vector2 | GuiObject)?>,
	DominantAxis: Derivable<Enum.DominantAxis>,
	Wrappeable: { Vector2 },
	LimitSize: boolean?,
	Scrollable: boolean?,
	AddPosition: ((wrap: Vector2) -> Vector2)?,
	CanvasPadding: number?,
	InnerPadding: number?,

	Children: (wrap: Vector2) -> any,
	TopChildren: Derivable<any>,
}

function GetAnchorPosition(position: Vector2 | GuiObject)
	if typeof(position) == "Vector2" then
		return position
	else
		return position.AbsolutePosition
	end
end

function GetAnchorSize(size: (Vector2 | GuiObject)?)
	if size then
		if typeof(size) == "Vector2" then
			return size
		else
			return size.AbsoluteSize
		end
	else
		return Vector2.new(0, 0)
	end
end

function GetOverlayFinalPosition(
	wrap: Vector2,
	anchorPos: Vector2,
	anchorSize: Vector2,
	canvasShape: { AbsoluteSize: Vector2, AbsolutePosition: Vector2 },
	padding: number,
	addPosition: ((wrap: Vector2) -> Vector2)?
)
	local anchorWrap = Vector2.new(math.clamp(wrap.X, 0, 1), math.clamp(wrap.Y, 0, 1))
	local paddingMultiplier = Vector2.new(
		(wrap.X > 1 and 1) or (wrap.X < 0 and -1) or 0, ---
		(wrap.Y > 1 and 1) or (wrap.Y < 0 and -1) or 0 ---
	)
	local setPadding = paddingMultiplier * padding
	local final = (setPadding + anchorPos + anchorWrap * anchorSize) - canvasShape.AbsolutePosition
	if addPosition then
		final += addPosition(wrap)
	end

	return final
end

function GetOverlayAnchorPoint(wrap: Vector2)
	return Vector2.new(
		(wrap.X > 1 and 0) or (wrap.X < 0 and 1) or wrap.X,
		(wrap.Y > 1 and 0) or (wrap.Y < 0 and 1) or wrap.Y
	)
end

local function read<T>(value: (() -> T) | T): T
	return if type(value) == "function" then value() else value
end

function OverlayHolder(props: OverlayHolderProps)
	local theme = useTheme()
	local overlayHolder = useOverlayHolder()
	local canvasShape = source({} :: { AbsoluteSize: Vector2, AbsolutePosition: Vector2 })
	local innerPadding = (props.InnerPadding or 0)

	local limitSize = if props.LimitSize == nil then true else props.LimitSize
	local scrollable = if props.Scrollable == nil then true else props.Scrollable
	local padding = function()
		return if props.Padding == nil then 0 else read(props.Padding)
	end

	local overlayInnerSize = source(Vector2.zero)
	local overlaySize = function()
		return overlayInnerSize() + (Vector2.one * innerPadding * 2)
	end

	local test = read(props.AnchorPosition)

	local anchorSize = source(GetAnchorSize(read(props.AnchorSize)))
	local anchorPos = source(GetAnchorPosition(read(props.AnchorPosition)))
	local currentWrap = source(props.Wrappeable[1])
	local limitedOverlaySize = source(nil :: Vector2?)

	effect(function()
		Shape(canvasShape).callback(overlayHolder())
	end)

	effect(function()
		local overlaySize = overlaySize()
		local anchorPos = anchorPos()
		local anchorSize = anchorSize()
		local canvasShape = canvasShape()

		local bestFit = nil
		local bestFitSize = Vector2.zero

		for i, wrap in props.Wrappeable do
			local position =
				GetOverlayFinalPosition(wrap, anchorPos, anchorSize, canvasShape, padding(), props.AddPosition)
			local anchor = GetOverlayAnchorPoint(wrap)
			local pos1 = position - (anchor * overlaySize)
			local pos2 = position + (anchor * overlaySize)
			local startPos = Vector2.min(pos1, pos2)
			local endPos = startPos + overlaySize
			local canvasPadding = Vector2.one * (props.CanvasPadding or 0)

			local croppedStart = Vector2.max(startPos, canvasPadding)
			local croppedEnd = Vector2.min(endPos, canvasShape.AbsoluteSize - canvasPadding)

			local visibleSize = Vector2.max(croppedEnd - croppedStart, Vector2.zero)
			if visibleSize.X >= overlaySize.X and visibleSize.Y >= overlaySize.Y then
				-- component fits entirely
				limitedOverlaySize(nil)
				currentWrap(wrap)
				return
			else
				-- component does not fit entirely
				if props.DominantAxis == Enum.DominantAxis.Width then
					if bestFitSize.X < visibleSize.X then
						bestFit = wrap
						bestFitSize = visibleSize
					end
				elseif props.DominantAxis == Enum.DominantAxis.Height then
					if bestFitSize.Y < visibleSize.Y then
						bestFit = wrap
						bestFitSize = visibleSize
					end
				end
			end
		end
		if bestFit then
			currentWrap(bestFit)
			limitedOverlaySize(bestFitSize)
		else
			currentWrap(props.Wrappeable[1])
			limitedOverlaySize(nil)
		end
	end)

	effect(function()
		local currentSize = read(props.AnchorSize)
		local currentPos = read(props.AnchorPosition)

		anchorSize(GetAnchorSize(currentSize))
		anchorPos(GetAnchorPosition(currentPos))

		if typeof(currentSize) == "Instance" then
			connect(currentSize:GetPropertyChangedSignal "AbsoluteSize", function()
				anchorSize(currentSize.AbsoluteSize)
			end)
		end
		if typeof(currentPos) == "Instance" then
			connect(currentPos:GetPropertyChangedSignal "AbsolutePosition", function()
				anchorPos(currentPos.AbsolutePosition)
			end)
		end
	end)

	local position = derive(function()
		local final = GetOverlayFinalPosition(
			currentWrap(),
			anchorPos(),
			anchorSize(),
			canvasShape(),
			padding(),
			props.AddPosition
		)
		return UDim2.fromOffset(final.X, final.Y)
	end)

	local overlayFrameHolder = Div {
		Name = "Overlay",
		props.HolderNative,
		{
			AnchorPoint = Vector2.new(0, 0),
			Position = UDim2.fromOffset(0, 0),
		},
		changed("AbsoluteSize", overlayInnerSize),
	}

	return Div {
		Name = "OverlayHolder",
		BackgroundColor3 = theme "Background2",
		Size = function()
			local overlaySize = overlaySize()
			if limitedOverlaySize() then
				local limited = Vector2.min(overlaySize, limitedOverlaySize() :: any)
				return UDim2.fromOffset(limited.X, limited.Y)
			else
				return UDim2.fromOffset(overlaySize.X, overlaySize.Y)
			end
		end,
		Position = position,
		AnchorPoint = function()
			return GetOverlayAnchorPoint(currentWrap())
		end,

		props.TopChildren,
		Div {
			Name = "OverlayChildren",
			ZIndex = 2,
			if props.InnerPadding then Padding { Padding = innerPadding } else nil,
			if props.Scrollable
				then Scroller {
					Name = "OverlayScroller",
					ScrollBarImageColor3 = theme "Emphasis",
					Size = function()
						if limitedOverlaySize() then
							return UDim2.new(1, 4, 1, 4)
						else
							return UDim2.fromScale(1, 1)
						end
					end,
					CanvasSize = function()
						local overlayInnerSize = overlayInnerSize()
						return UDim2.fromOffset(overlayInnerSize.X, overlayInnerSize.Y)
					end,
					overlayFrameHolder,
				}
				else overlayFrameHolder,
		},
	}
end

return OverlayHolder
