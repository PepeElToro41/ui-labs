local Vide = require "@pkg/vide"
local PRESETS = require "@constants/ui-presets"
local IMAGES = require "@constants/images"
local useTheme = require("@contexts/theme").useTheme
local boolean = require("@utils/vide/derivers").boolean

local source = Vide.source
local create = Vide.create

type Source<T> = Vide.Source<T>

local PanelButton = require "./panel-button"
local Divisor = require "@ui/elements/divisor"

local Div = require "@styles/div"
local Frame = require "@styles/frame"
local LeftList = require "@styles/list/left"
local Padding = require "@styles/padding"
local Corner = require "@styles/corner"

type PanelRender = {
	PanelAnchored: Source<boolean>,
	PanelCollapsed: Source<boolean>,
	PanelLayout: Source<"Bottom" | "Right">,
	FollowOverlay: Source<boolean>,
}

function PanelRender(props: PanelRender)
	local theme = useTheme()

	return Frame {
		Name = "PanelRender",
		BackgroundColor3 = theme "Background3",

		Corner { Radius = 8 },
		Frame {
			Name = "CornerCover",
			BackgroundColor3 = theme "Background3",
			PRESETS.BottomLeft,
			Size = UDim2.new(1, 0, 0, 10),
			ZIndex = -1,
		},
		Div {
			Name = "Title",
			Size = UDim2.new(1, 0, 0, 32),
			Div {
				Name = "Tabs",

				LeftList { Gap = 6 },
				Div {
					Name = "TabList",
					Size = UDim2.fromScale(0, 1),
					AutomaticSize = Enum.AutomaticSize.X,

					create "UIFlexItem" { FlexMode = Enum.UIFlexMode.Fill },
					LeftList(),
					Padding { PaddingX = 5, Bottom = 2 },
				},
				Div {
					Name = "Buttons",
					Size = UDim2.fromScale(0, 1),
					AutomaticSize = Enum.AutomaticSize.X,
					LeftList { Gap = 6, VerticalAlignment = Enum.VerticalAlignment.Center },
					Padding { PaddingX = 6 },

					PanelButton {
						ButtonIcon = boolean(props.FollowOverlay, IMAGES.FollowOverlayOn, IMAGES.FollowOverlayOff),
						Active = props.FollowOverlay,
						OnClick = function()
							props.FollowOverlay(not props.FollowOverlay())
						end,
					},
					PanelButton {
						ButtonIcon = function()
							return (props.PanelLayout() == "Bottom" and IMAGES.PanelRight) or IMAGES.PanelBottom
						end,
						ButtonSize = 16,
						OnClick = function()
							if props.PanelLayout() == "Bottom" then
								props.PanelLayout("Right")
							elseif props.PanelLayout() == "Right" then
								props.PanelLayout("Bottom")
							end
						end,
					},
					PanelButton {
						ButtonIcon = boolean(props.PanelAnchored, IMAGES.AnchorOn, IMAGES.AnchorOff),
						Active = props.PanelAnchored,
						OnClick = function()
							props.PanelAnchored(not props.PanelAnchored())
						end,
					},
					Divisor { Direction = "Y", Size = UDim.new(0, 14) },
					PanelButton {
						ButtonIcon = IMAGES.Close,
						OnClick = function()
							props.PanelCollapsed(not props.PanelCollapsed())
						end,
					},
				},
			},
		},
	}
end

return PanelRender
