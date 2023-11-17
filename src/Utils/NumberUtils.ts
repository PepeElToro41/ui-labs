export function ToVector2(convert: Vector3) {
	return new Vector2(convert.X, convert.Y);
}

export function ToVector3(convert: Vector2) {
	return new Vector3(convert.X, convert.Y, 0);
}

export function Lerp(a: number, b: number, alpha: number) {
	return a + (b - a) * alpha;
}

export function Counter() {
	let count = 0;
	return () => {
		const current = count;
		count++;
		return current;
	};
}
