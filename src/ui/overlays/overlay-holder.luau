local Vide = require "@pkg/vide"
local useTheme = require("@contexts/theme").useTheme
local connect = require("@utils/vide").connect
local useOverlayHolder = require("@contexts/app-render/overlay-holder").useOverlayHolder
local Shape = require("@actions").Shape

local changed = Vide.changed
local source = Vide.source
local effect = Vide.effect
local read = Vide.read
local derive = Vide.derive
local untrack = Vide.untrack

local Div = require "@base/div"
local Frame = require "@base/frame"

type OverlayHolderProps = {
	HolderNative: Vide.vFrame,
	Padding: Derivable<number>,
	AnchorPosition: Derivable<Vector2 | GuiObject>,
	AnchorSize: Derivable<(Vector2 | GuiObject)?>,
	DominantAxis: Derivable<Enum.DominantAxis>,
	Wrappeable: { Vector2 },

	Children: (wrap: Vector2) -> any,
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
	padding: number
)
	local anchorWrap = Vector2.new(math.clamp(wrap.X, 0, 1), math.clamp(wrap.Y, 0, 1))
	local paddingMultiplier = Vector2.new(
		(wrap.X > 1 and 1) or (wrap.X < 0 and -1) or 0, ---
		(wrap.Y > 1 and 1) or (wrap.Y < 0 and -1) or 0 ---
	)
	local setPadding = paddingMultiplier * read(padding :: number)
	local final = (setPadding + anchorPos + anchorWrap * anchorSize) - canvasShape.AbsolutePosition
	return final
end

function GetOverlayAnchorPoint(wrap: Vector2)
	return Vector2.new(
		(wrap.X > 1 and 0) or (wrap.X < 0 and 1) or wrap.X,
		(wrap.Y > 1 and 0) or (wrap.Y < 0 and 1) or wrap.Y
	)
end

function OverlayHolder(props: OverlayHolderProps)
	local theme = useTheme()
	local overlayHolder = useOverlayHolder()
	local canvasShape = source({} :: { AbsoluteSize: Vector2, AbsolutePosition: Vector2 })

	effect(function()
		Shape(canvasShape).callback(overlayHolder())
	end)

	local overlaySize = source(Vector2.zero)
	local anchorSize = source(GetAnchorSize(read(props.AnchorSize)))
	local anchorPos = source(GetAnchorPosition(read(props.AnchorPosition)))
	local currentWrap = source(props.Wrappeable[1] or Vector2.new(0, 0))

	if props.Wrappeable and #props.Wrappeable > 1 then
		effect(function()
			local overlaySize = overlaySize()
			local anchorPos = anchorPos()
			local anchorSize = anchorSize()
			local canvasShape = canvasShape()
			local padding = read(props.Padding)

			local bestFit = nil
			local bestFitSize = Vector2.zero

			for i, wrap in props.Wrappeable do
				local position = GetOverlayFinalPosition(wrap, anchorPos, anchorSize, canvasShape, padding)
				local anchor = GetOverlayAnchorPoint(wrap)
				local pos1 = position - (anchor * overlaySize)
				local pos2 = position + (anchor * overlaySize)
				local startPos = Vector2.min(pos1, pos2)
				local endPos = startPos + overlaySize

				local croppedStart = Vector2.max(startPos, Vector2.zero)
				local croppedEnd = Vector2.min(endPos, canvasShape.AbsoluteSize)

				local visibleSize = Vector2.max(croppedEnd - croppedStart, Vector2.zero)
				if visibleSize.X >= overlaySize.X and visibleSize.Y >= overlaySize.Y then
					-- component fits entirely
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
			currentWrap(bestFit)
		end)
	end

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
		local final =
			GetOverlayFinalPosition(currentWrap(), anchorPos(), anchorSize(), canvasShape(), read(props.Padding))
		return UDim2.fromOffset(final.X, final.Y)
	end)

	return Frame {
		BackgroundColor3 = theme "Background2",
		Size = UDim2.fromOffset(100, 100),
		Position = position,
		AnchorPoint = function()
			return GetOverlayAnchorPoint(currentWrap())
		end,

		Vide.create "UIStroke" {
			Color = Color3.new(1, 1, 1),
			Transparency = 0.5,
		},
		Div {
			Name = "OverlayHolder",
			props.HolderNative,
			{
				AnchorPoint = Vector2.new(0, 0),
				Position = UDim2.fromOffset(0, 0),
			},
			changed("AbsoluteSize", overlaySize),
		},
	}
end

return OverlayHolder
