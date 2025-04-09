export type SliderControl = {
	Min: number,
	Max: number,
	Step: number?,
}

type NumberControl = {
	Min: number?,
	Max: number?,
	Step: number?,
	Dragger: boolean,
	Sensitivity: number,
	Prefix: string?,
}

type BooleanControl = {}
