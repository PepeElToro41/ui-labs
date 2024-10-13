local Vide = require "@pkg/vide"

-- TODO: Use a lifetime hook for unmounting animations
local indexes = Vide.indexes
local create = Vide.create

local Div = require "@styles/div"
local Frame = require "@styles/frame"
local LeftList = require "@styles/list/left"
local Padding = require "@styles/padding"
local Corner = require "@styles/corner"

local Shadow = require "@ui/elements/shadow"
local PreviewEntry = require "./preview-entry"

local useAtom = require("@utils/charm").useAtom
local MappedPreviews = require("@store/story-previews/consume").MappedPreviews
local useTheme = require("@contexts/theme").useTheme

function PreviewList()
	local theme = useTheme()
	local previews = useAtom(MappedPreviews)

	return Div {
		Size = UDim2.new(1, 0, 0, 32),
		Padding { Top = 2, Bottom = 1, PaddingX = 6 },
		Frame {
			BackgroundColor3 = theme "Background1",

			create "UIStroke" {
				Thickness = 1,
				Color = theme "Border",
				Transparency = 0.75,
			},
			Corner { Radius = 10 },
			Padding { Padding = 2 },
			LeftList { Gap = 2 },
			indexes(previews, function(preview, uid)
				return PreviewEntry { Preview = preview }
			end),
		},
		Shadow {
			Blur = 0.8,
			Position = Vector2.zero,
			ZIndex = -1,
			Transparency = 0.3,
			Extends = Vector2.new(16, 16),
		},
	}
end

return PreviewList
