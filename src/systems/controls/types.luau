local ecs = require "@vendor/ecs"

export type ControlType = "String" | "Number" | "Boolean" | "Color3" | "Choose" | "EnumList" | "RGBA" | "Slider" | "Object"

--- A converted ui-labs control object, stored untouched on `c.control`
export type Control = {
	EntryType: "Control",
	Type: ControlType,
	ControlValue: unknown,
	Order: number?,

	-- per-type extras, read by the recoverers
	Filters: { (input: string, old: string) -> string }?,
	Min: number?,
	Max: number?,
	Step: number?,
	List: any?,
	DefIndex: (number | string)?,
	ClassName: string?,
	Predicator: ((instance: Instance) -> boolean)?,
}

export type ControlGroup = {
	EntryType: "ControlGroup",
	Controls: Map<string, Control>,
	Order: number?,
}

export type ConvertedEntry = Control | ControlGroup
export type ConvertedControls = Map<string, ConvertedEntry>

-- recovery data kept on the preview between mounts
export type RecoverControl = { kind: "control", control: Control, value: unknown }
export type RecoverGroup = { kind: "group", controls: Map<string, RecoverControl> }
export type RecoverEntry = RecoverControl | RecoverGroup
export type RecoverData = Map<string, RecoverEntry>

--- Decides whether an old value can be reused by a new control definition
export type Recoverer = (control: Control, old_control: Control, old_value: unknown) -> (boolean, unknown)

-- what a mounter gets from `map_states`: the nested tree handed to the story + a flat lookup
export type StateTree<S> = Map<string, S | Map<string, S>>
export type ByEntity<S> = Map<ecs.Entity, S>
export type Values = Map<string, unknown>

return nil
