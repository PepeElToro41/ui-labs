local use_world = require "@contexts/world/use-world"
local use_component = require "@hooks/use-component"
local vide = require "@pkg/vide"
local c = require "@src/components"
local controls = require "@src/systems/controls"
local ecs = require "@vendor/ecs"
local object_control = require "./advanced/object"
local slider_control = require "./advanced/slider"
local columns = require "./columns"
local control_holder = require "./control-holder"
local color_control = require "./datatype/color"
local boolean_control = require "./primitive/boolean"
local number_control = require "./primitive/number"
local string_control = require "./primitive/string"
local types = require "./types"
local unsupported_control = require "./unsupported"

type ControlEntryProps = {
	entity: ecs.Entity,
	order: Derivable<number>?,
	columns: columns.Columns,
	indent: number?,
}

type Renderer = (control: controls.Control, props: types.ControlProps<any, any>) -> Instance

-- each renderer takes its own control shape, the converted ui-labs object gets adapted to it
local RENDERERS: Map<string, Renderer> = {
	String = function(control, props)
		props.control = { Filters = control.Filters, MultiLine = true } :: types.StringControl
		return string_control(props)
	end,
	Number = function(control, props)
		local number = control :: any
		props.control = {
			Min = control.Min,
			Max = control.Max,
			Step = control.Step,
			Dragger = number.Dragger,
			Sensitivity = number.Sensibility,
			Prefix = number.Prefix,
		} :: types.NumberControl
		return number_control(props)
	end,
	Boolean = function(_, props)
		props.control = {}
		return boolean_control(props)
	end,
	Slider = function(control, props)
		props.control = {
			Min = control.Min :: number,
			Max = control.Max :: number,
			Step = control.Step,
		} :: types.SliderControl
		return slider_control(props)
	end,
	Color3 = function(_, props)
		props.control = {}
		return color_control(props)
	end,
	Object = function(control, props)
		props.control = {
			ClassName = control.ClassName or "Instance",
			Predicator = control.Predicator,
		} :: types.ObjectControl
		return object_control(props)
	end,
}

--- One control entity as a row of the table. The control object never changes while the entity
--- lives (controls are recreated on every mount), only its value does
local function control_entry(props: ControlEntryProps)
	local world = use_world()
	local entity = props.entity

	local control = world.get(entity, c.control) :: controls.Control
	local name = world.get(entity, c.control_name) :: string

	-- the value is set before the entity joins its parent, so it always exists by the time the
	-- row mounts. nil is a real value (a cleared object control), not a missing one
	local value = use_component(entity, c.control_value)

	local control_props: types.ControlProps<any, any> = {
		name = name,
		control = control,
		value = value,
		apply = function(new: unknown)
			-- an input can still commit while its story is being unmounted
			if not world.exists(entity) then
				return
			end
			world.set(entity, c.control_value, new)
		end :: (unknown) -> (),
		reset = function()
			controls.reset_control(world, entity)
		end,
	}

	local renderer = RENDERERS[control.Type]
	local row = control_holder {
		name = name,
		order = props.order,
		columns = props.columns,
		indent = props.indent,
		children = if renderer then renderer(control, control_props) else unsupported_control { type = control.Type },
	}

	-- vide.values only unparents the rows it drops
	vide.cleanup(row)
	return row
end

return control_entry
