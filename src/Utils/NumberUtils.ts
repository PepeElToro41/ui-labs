export function ToVector2(convert: Vector3) {
	return new Vector2(convert.X, convert.Y);
}

export function ToVector3(convert: Vector2) {
	return new Vector3(convert.X, convert.Y, 0);
}

export function UDim2ToVector2(convert: UDim2) {
	return new Vector2(convert.X.Offset, convert.Y.Offset);
}

export function UDimOffset(udim: UDim2) {
	return udim.X.Offset + udim.Y.Offset;
}

export function Lerp(a: number, b: number, alpha: number) {
	return a + (b - a) * alpha;
}

export function Counter(start?: number) {
	let count = start ?? 0;
	return (add?: number) => {
		const current = count;
		count += add ?? 1;
		return current;
	};
}
