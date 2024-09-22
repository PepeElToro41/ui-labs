//These utiltiies helps you with prop drilling XD

export namespace PropDefault {
	export function Position(props: Position) {
		return {
			Position: UDim2.fromScale(0, 0),
			AnchorPoint: new Vector2(0, 0),
			LayoutOrder: 0,
			...PropFilter.Position(props),
		} as Position;
	}
	export function Size(props: Size) {
		return {
			Size: UDim2.fromScale(1, 1),
			...PropFilter.Size(props),
		} as Size;
	}
	export function Shape(props: Shape) {
		return {
			...Position(props),
			...Size(props),
		} as Shape;
	}
}

export namespace PropFilter {
	export function Position(props: Position) {
		return {
			Position: props.Position,
			AnchorPoint: props.AnchorPoint,
			LayoutOrder: props.LayoutOrder,
		} as Position;
	}
	export function Size(props: Size) {
		return {
			Size: props.Size,
		} as Size;
	}
	export function Shape(props: Shape) {
		return {
			...Position(props),
			...Size(props),
		} as Shape;
	}
}
export namespace Presets {
	export const Centered = {
		Position: UDim2.fromScale(0.5, 0.5),
		AnchorPoint: new Vector2(0.5, 0.5),
	};
}
