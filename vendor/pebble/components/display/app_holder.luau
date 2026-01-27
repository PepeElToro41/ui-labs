local vide = require "@pkg/vide"
local snapping = require(script.Parent.snapping)

local create = vide.create
local cleanup = vide.cleanup

export type SnapAreaContext = {
	target: any,
	docks: {
		snap_area: (props: snapping.snap_area) -> Frame,
		snappable: (props: snapping.snappable) -> (),
	},
}

local context = vide.context() :: vide.Context<SnapAreaContext>

local function app_holder(props: { target: any, children: () -> any })
	local docks = snapping()

	local holder = create "Frame" {
		Size = UDim2.new(0, 16, 1, 0),
		BackgroundTransparency = 1,
		AutoLocalize = false,
		docks.snap_area {},
	}
	holder.Parent = props.target
	cleanup(holder)

	return context({
		target = props.target,
		docks = docks,
	}, props.children)
end

return {
	context = context,
	app_holder = app_holder,
}
