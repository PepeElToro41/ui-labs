export const Decoders = {
	Default: (input: string) => input as never,
	NumberDecoder: (roundMethod?: "floor" | "ceil" | "round") => {
		return (input: string) => {
			const parsed = tonumber(input);
			if (parsed !== undefined) {
				if (roundMethod) {
					return math[roundMethod](parsed);
				}
				return parsed;
			} else return;
		};
	},
};
