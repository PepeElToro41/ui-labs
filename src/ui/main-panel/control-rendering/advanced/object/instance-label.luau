local vide = require "@pkg/vide"
local div = require "@ui/styles/div"
local image = require "@ui/styles/image"
local left_list = require "@ui/styles/list/left-list"
local text = require "@ui/styles/text"

local StudioService = game:GetService "StudioService"

type ClassIcon = {
	Image: string,
	ImageRectOffset: Vector2,
	ImageRectSize: Vector2,
}

type InstanceLabelProps = {
	instance: Reactive<Instance?>,

	icon_size: number?,
	text_size: number?,
	min_width: number?,
	max_width: number?,
	order: number?,

	native: vide.vFrame?,
}

-- keeps a reactive copy of the instance name, following renames
local function use_instance_name(instance: Reactive<Instance?>): Reactive<string>
	local name = vide.source ""

	vide.effect(function()
		local object = instance()
		if not object then
			name ""
			return
		end

		name(object.Name)
		local connection = object:GetPropertyChangedSignal("Name"):Connect(function()
			name(object.Name)
		end)
		vide.cleanup(function()
			connection:Disconnect()
		end)
	end)

	return name
end

-- displays the class icon of an instance next to its name
local function instance_label(props: InstanceLabelProps)
	local icon_size = props.icon_size or 16
	local name = use_instance_name(props.instance)

	local class_icon = vide.derive(function(): ClassIcon?
		local object = props.instance()
		if not object then
			return nil
		end
		return StudioService:GetClassIcon(object.ClassName) :: any
	end)

	return div {
		Name = "instance_label",
		Size = UDim2.fromScale(0, 1),
		AutomaticSize = Enum.AutomaticSize.X,
		LayoutOrder = props.order,
		props.native or {},

		left_list {
			gap = 6,
			VerticalAlignment = Enum.VerticalAlignment.Center,
		},
		image {
			Name = "class_icon",
			LayoutOrder = 1,
			Size = UDim2.fromOffset(icon_size, icon_size),
			Image = function()
				local icon = class_icon()
				return if icon then icon.Image else ""
			end,
			ImageRectOffset = function()
				local icon = class_icon()
				return if icon then icon.ImageRectOffset else Vector2.zero
			end,
			ImageRectSize = function()
				local icon = class_icon()
				return if icon then icon.ImageRectSize else Vector2.zero
			end,
		},
		text {
			Name = "instance_name",
			LayoutOrder = 2,
			Size = UDim2.fromScale(0, 1),
			AutomaticSize = Enum.AutomaticSize.X,
			TextSize = props.text_size or 13,
			TextXAlignment = Enum.TextXAlignment.Left,
			TextTruncate = Enum.TextTruncate.AtEnd,
			Text = name,

			vide.create "UISizeConstraint" {
				MinSize = Vector2.new(props.min_width or 40, 0),
				MaxSize = Vector2.new(props.max_width or 200, math.huge),
			},
		},
	}
end

return instance_label
