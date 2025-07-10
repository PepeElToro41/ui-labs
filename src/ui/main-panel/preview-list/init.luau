local Vide = require "@pkg/vide"

-- TODO: Use a lifetime hook for unmounting animations
local indexes = Vide.indexes
local create = Vide.create

local Div = require "@base/div"
local Frame = require "@base/frame"
local LeftList = require "@base/list/left"
local Padding = require "@base/padding"
local Corner = require "@base/corner"

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
		Padding { Top = 2, Bottom = 1, PaddingX = 4 },
		Div {
			Corner { Radius = 10 },
			Padding { Padding = 2 },
			LeftList { Gap = 2 },
			indexes(previews, function(preview: any, uid: any)
				return PreviewEntry { Preview = preview }
			end) :: any,
		},
	}
end

return PreviewList
