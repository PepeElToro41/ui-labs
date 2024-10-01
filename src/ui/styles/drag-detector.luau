local Vide = require "@pkg/vide"

local Extract = require("@utils/vide/props").Extract
local ListenDragging = require("@actions").ListenDragging

type Source<T> = Vide.Source<T>

local connect = Vide.connect

type DragDetectorProps = {
	Dragging: Source<boolean>?,
	DragChanged: ((delta: UDim2) -> ())?,
} & Vide.vUIDragDetector

function DragDetector(props: DragDetectorProps)
	local dragging = Extract(props, "Dragging") :: Source<boolean>
	local dragChanged = Extract(props, "DragChanged") :: (delta: UDim2) -> ()

	local dragger = Vide.create "UIDragDetector"(props)

	if dragging then ListenDragging(dragging).callback(dragger) end

	if dragChanged then connect(dragger.DragContinue, function()
		dragChanged(dragger.DragUDim2)
	end) end

	return dragger
end

return DragDetector
