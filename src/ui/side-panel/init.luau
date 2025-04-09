local Vide = require "@pkg/vide"
local useTheme = require("@contexts/theme").useTheme
local FilterContext = require("@ui/side-panel/filtering").FilterContext

local Frame = require "@base/frame"
local TopList = require "@base/list/top"
local Padding = require "@base/padding"

local Branding = require "./branding"
local StorySearch = require "./story-search"
local StoryExplorer = require "./story-explorer"

local source = Vide.source

function SidePanel()
	local theme = useTheme()
	local filter: Vide.Source<string?> = source()

	local function SetFilter(input: string)
		if input == "" then
			filter(nil)
		else
			filter(input)
		end
	end

	return FilterContext(filter, function()
		return Frame {
			Name = "SidePanelRender",
			BackgroundColor3 = theme "Background2",
			ClipsDescendants = true,

			TopList { HorizontalAlignment = Enum.HorizontalAlignment.Center, Gap = 10 },
			Padding { PaddingX = 10, PaddingY = 6 },
			Branding(),
			StorySearch { OnFilterChange = SetFilter },
			StoryExplorer { Filter = filter },
		}
	end)
end

return SidePanel
