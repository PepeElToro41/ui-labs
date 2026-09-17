local vide = require "@pkg/vide"
local div = require "@ui/styles/div"
local actions = require "@utils/vide/actions"

local read = vide.read

type MeasuredFrameProps = {
	-- props for the inner frame, this is where AutomaticSize should be set
	native: vide.vFrame,
	-- children of the outer frame, these can use full size (1, 1) safely
	outer_native: vide.vFrame?,
	outer_children: { Instance }?,
}

--[[
	Renders an automatically sized frame inside a fixed size holder.

	The inner frame (native) is the one that uses AutomaticSize, its AbsoluteSize is
	listened to and applied as an offset size to the outer frame on the automatic axes.
	The outer frame never has AutomaticSize, so full size (1, 1) children can be added to
	it (hover effects, detectors, highlights) without breaking the automatic sizing.

	On axes not covered by AutomaticSize the outer frame uses the Size of the inner frame,
	Name and LayoutOrder are also taken from the inner frame.
]]
local function measured_frame(props: MeasuredFrameProps)
	local native = props.native
	local measured = vide.source(Vector2.zero)

	local function automatic_axis(axis: "X" | "Y")
		local automatic = read(native.AutomaticSize) or Enum.AutomaticSize.None
		return automatic == Enum.AutomaticSize.XY or automatic == (Enum.AutomaticSize :: any)[axis]
	end

	local function size()
		local base = (read(native.Size) or UDim2.fromScale(1, 1)) :: UDim2
		local absolute = measured()

		return UDim2.new(
			if automatic_axis "X" then UDim.new(0, absolute.X) else base.X,
			if automatic_axis "Y" then UDim.new(0, absolute.Y) else base.Y
		)
	end

	return div {
		Name = native.Name or "measured_frame",
		Size = size,
		LayoutOrder = native.LayoutOrder,

		props.outer_native or {},
		props.outer_children or {},
		div {
			Name = "measured",
			native,

			actions.absolute_size(measured),
		},
	}
end

return measured_frame
