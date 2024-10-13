local Vide = require "@pkg/vide"
local useTheme = require("@contexts/theme").useTheme

local create = Vide.create
local source = Vide.source

local Div = require "@styles/div"
local Frame = require "@styles/frame"
local TopList = require "@styles/list/top"

local Background = require "./background"
local HiddenCollapseToolbar = require "./toolbar/hidden-collapse"
local PreviewsSystem = require "./story-render/previews-system"
local TabsPanel = require("./tabs-panel")
local PreviewList = require("./preview-list")

function MainPanel()
	local theme = useTheme()
	local panelExtends = source(Vector2.new(0, 0))
	local panelAnchored = source(true)
	local followOverlay = source(false)

	return Frame {
		Name = "MainPanel",
		BackgroundColor3 = theme "Background1",

		create "UIFlexItem" { FlexMode = Enum.UIFlexMode.Fill },

		Background(),
		Div {
			Name = "StoryPanel",
			Size = function()
				local extends = panelAnchored() and panelExtends() or Vector2.zero
				return UDim2.new(1, -extends.X, 1, -extends.Y)
			end,

			TopList(),
			PreviewList(),
			Div {
				Name = "StoryRender",

				PreviewsSystem(),
				HiddenCollapseToolbar(),
			},
		},
		TabsPanel {
			PanelAnchored = panelAnchored,
			PanelExtends = panelExtends,
			FollowOverlay = followOverlay,
		},
	}
end

return MainPanel
