local vide = require "@pkg/vide"

local function drag_detector(props: vide.vUIDragDetector)
	return vide.create "UIDragDetector"(props)
end

return drag_detector
