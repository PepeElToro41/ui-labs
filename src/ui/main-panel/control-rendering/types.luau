export type ControlProps<T, V> = {
	name: string,
	control: T,
	order: number?,

	value: Reactive<V>,
	apply: (val: V) -> any,
	reset: () -> (),
}

export type SliderControl = {
	Min: number,
	Max: number,
	Step: number?,
}

export type NumberControl = {
	Min: number?,
	Max: number?,
	Step: number?,
	Dragger: boolean,
	Sensitivity: number,
	Prefix: string?,
}

type Filter = (input: string, oldInput: string) -> string

export type StringControl = {
	Filters: { Filter }?,
	MultiLine: boolean,
}

return nil
