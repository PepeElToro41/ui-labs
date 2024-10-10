local Vide = require "@pkg/vide"
local Dictionary = require("@pkg/sift").Dictionary

local source = Vide.source
local switch = Vide.switch

type Source<T> = Vide.Source<T>

local Div = require "@styles/div"
local ResizablePanel = require "@ui/holders/resizable-panel"
local PanelRender = require "./panel-render"

type TabsPanelProps = {
	PanelAnchored: Source<boolean>,
	FollowOverlay: Source<boolean>,
	PanelExtends: Source<Vector2>,
}

function TabsPanel(props: TabsPanelProps)
	-- TODO: Plugin Saveable
	local layout: Source<"Bottom" | "Right"> = source("Bottom")
	local panelCollapsed = source(false)

	local CommonProps = {
		Name = "TabsPanel",
		MaximumSize = 600,
		MinimumSize = 100,
		CollapseThreshold = 50,
		UncollapseThreshold = 75,
		Collapsed = panelCollapsed,
	}

	return switch(layout) {
		Bottom = function()
			return ResizablePanel(Dictionary.merge({
				HandleAxis = "Top",
				PanelSize = 200,
				PanelNative = {
					Position = UDim2.fromScale(0, 1),
					AnchorPoint = Vector2.new(0, 1),
				},
				ContentsNative = {
					BackgroundTransparency = 1,
					Vide.changed("AbsoluteSize", function(size: Vector2)
						props.PanelExtends(Vector2.new(0, size.Y))
					end),
				},

				["children"] = {
					PanelRender {
						PanelAnchored = props.PanelAnchored,
						PanelCollapsed = panelCollapsed,
						FollowOverlay = props.FollowOverlay,
						PanelLayout = layout,
					},
				},
			}, CommonProps))
		end,
		Right = function()
			return ResizablePanel(Dictionary.merge({
				HandleAxis = "Left",
				PanelSize = 300,
				PanelNative = {
					Position = UDim2.fromScale(1, 0),
					AnchorPoint = Vector2.new(1, 0),
				},
				ContentsNative = {
					BackgroundTransparency = 1,
					Vide.changed("AbsoluteSize", function(size: Vector2)
						props.PanelExtends(Vector2.new(size.X, 0))
					end),
				},

				["children"] = {
					PanelRender {
						PanelAnchored = props.PanelAnchored,
						PanelCollapsed = panelCollapsed,
						PanelLayout = layout,
						FollowOverlay = props.FollowOverlay,
					},
				},
			}, CommonProps))
		end,
	}
end

return TabsPanel
