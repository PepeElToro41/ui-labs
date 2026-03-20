export const Parsers = {
	Default: (object: unknown) => tostring(object),
	NumberParser: (decimals?: number, roundMethod?: "floor" | "ceil" | "round") => {
		return (value: number) => {
			if (decimals !== undefined) {
				return tostring(math[roundMethod ?? "floor"](value * 10 ** decimals) / 10 ** decimals);
			}
			return tostring(value);
		};
	}
};
