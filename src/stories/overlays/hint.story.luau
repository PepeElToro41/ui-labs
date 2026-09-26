local app_render_provider = require "@contexts/app-render/app-render-provider"
local use_overlay = require "@contexts/app-render/use-overlay"
local ui_labs = require "@pkg/ui-labs"
local vide = require "@pkg/vide"
local hint_popup = require "@ui/overlays/hint-popup"
local corner = require "@ui/styles/corner"
local div = require "@ui/styles/div"

vide.strict = false

local ANCHOR_NAMES = {
	"auto",
	"above",
	"below",
	"left",
	"right",
	"below, left edge",
	"below, right edge",
	"right, top edge",
	"diagonal",
	"on top",
}

local ANCHORS: { [string]: any } = {
	-- "auto" is not here, nil uses the hint defaults

	-- both vertical places, only the order changes: the first one is used unless it doesnt fit
	["above"] = { Vector2.new(0.5, -1), Vector2.new(0.5, 2) },
	["below"] = { Vector2.new(0.5, 2), Vector2.new(0.5, -1) },
	["left"] = Vector2.new(-1, 0.5),
	["right"] = Vector2.new(2, 0.5),
	["below, left edge"] = { Vector2.new(0, 2), Vector2.new(0, -1) },
	["below, right edge"] = { Vector2.new(1, 2), Vector2.new(1, -1) },
	["right, top edge"] = Vector2.new(2, 0),
	-- every corner, so dragging the target to an edge shows each diagonal rotation
	["diagonal"] = {
		Vector2.new(2, 2),
		Vector2.new(-1, 2),
		Vector2.new(2, -1),
		Vector2.new(-1, -1),
	},
	-- no arrow, the hint is not on any side of the target
	["on top"] = Vector2.new(0.5, 0.5),
}

type HoverTarget = {
	text: string,
	anchor: any,
	position: UDim2,
}

local controls = {
	anchor = ui_labs.Choose(ANCHOR_NAMES),
	padding = ui_labs.Slider(4, 0, 30, 1),
	text = ui_labs.String "this is a hint",
}

-- hovered targets, each one shows its own hint while the dragged target keeps showing its hint.
-- they sit far enough from the top for the hint above to fit
local HOVER_TARGETS: { HoverTarget } = {
	{ text = "hint below", anchor = ANCHORS["below"], position = UDim2.new(0.5, -130, 0, 120) },
	{ text = "hint above", anchor = ANCHORS["above"], position = UDim2.new(0.5, 0, 0, 120) },
	{ text = "hint to the right", anchor = Vector2.new(2, 0.5), position = UDim2.new(0.5, 130, 0, 120) },
}

local function target_button(props: vide.vTextButton)
	return vide.create "TextButton" {
		AnchorPoint = Vector2.new(0.5, 0.5),
		Size = UDim2.fromOffset(120, 32),
		BackgroundColor3 = Color3.fromRGB(60, 120, 220),
		BorderSizePixel = 0,
		TextColor3 = Color3.new(1, 1, 1),
		FontFace = Font.fromName("GothamSSm", Enum.FontWeight.Medium),
		TextSize = 14,
		AutoButtonColor = false,

		corner { radius = 6 },
		props,
	}
end

local function hover_target(props: HoverTarget)
	local overlay = use_overlay()

	local target: TextButton
	target = target_button {
		Name = "hover_target",
		Position = props.position,
		Text = "hover me",

		MouseEnter = function()
			overlay.show(function()
				return hint_popup {
					target = target,
					anchor = props.anchor,
					text = props.text,
				}
			end)
		end,
		MouseLeave = overlay.hide,
	}
	return target
end

return ui_labs.CreateVideStory({
	vide = vide,
	controls = controls,
}, function(props)
	return app_render_provider {
		children = function()
			local overlay = use_overlay()

			-- the target is draggable so the wrapping and the arrow can be tested against every edge
			local target = target_button {
				Name = "target",
				Position = UDim2.fromScale(0.5, 0.5),
				Text = "drag me",

				vide.create "UIDragDetector" {},
			}

			-- the anchor is not reactive, the hint is shown again when it changes
			vide.effect(function()
				local anchor = ANCHORS[props.controls.anchor()]
				overlay.show(function()
					return hint_popup {
						target = target,
						anchor = anchor,
						padding = props.controls.padding,
						text = props.controls.text,
					}
				end)
			end)

			local hover_targets = {}
			for _, hover in HOVER_TARGETS do
				table.insert(hover_targets, hover_target(hover))
			end

			return div {
				Name = "hint_story",
				target,
				hover_targets,
			}
		end,
	}
end)
