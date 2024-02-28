export const Parsers = {
	Default: (object: unknown) => tostring(object),
	NumberParser: (roundMethod?: "floor" | "ceil" | "round") => {
		return (value: number) => {
			if (roundMethod) {
				return tostring(math[roundMethod](value));
			}
			return tostring(value);
		};
	},
};
