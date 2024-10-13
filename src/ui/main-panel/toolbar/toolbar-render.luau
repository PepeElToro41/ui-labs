local Vide = require "@pkg/vide"
local IMAGES = require "@constants/images"
local Divisor = require "@ui/elements/divisor"
local ToolbarButton = require "./toolbar-button"

local Div = require "@styles/div"
local Padding = require "@styles/padding"
local TopList = require "@styles/list/top"

type Source<T> = Vide.Source<T>

local changed = Vide.changed

type ToolbarRenderProps = {
	SizeOutput: Source<number>,
}

function ToolbarRender(props: ToolbarRenderProps)
	return Div {
		Size = UDim2.new(1, 0, 0, 0),
		AutomaticSize = Enum.AutomaticSize.Y,
		Padding { PaddingY = 2, PaddingX = 6 },
		TopList { Gap = 4, HorizontalAlignment = Enum.HorizontalAlignment.Center },

		ToolbarButton { Image = IMAGES.Reload },
		ToolbarButton { Image = IMAGES.ZoomIn },
		ToolbarButton { Image = IMAGES.ZoomOut },
		Divisor { Direction = "X" },
		ToolbarButton { Image = IMAGES.Reload },
		ToolbarButton { Image = IMAGES.ZoomIn, Expand = true },
		ToolbarButton { Image = IMAGES.ZoomOut, Expand = true },
		Divisor { Direction = "X" },
		ToolbarButton { Image = IMAGES.Reload },
		ToolbarButton { Image = IMAGES.ZoomIn },
		ToolbarButton { Image = IMAGES.ZoomOut },

		changed("AbsoluteSize", function(size)
			props.SizeOutput(size.Y)
		end),
	}
end

return ToolbarRender
