export const Filters = {
	MaxLenght: (MaxLenght: number) => {
		return (ToFilterString: string) => {
			if (ToFilterString.size() > MaxLenght) {
				return ToFilterString.sub(0, MaxLenght);
			} else {
				return ToFilterString;
			}
		};
	},
	NumberOnly: (toFilter: string, old: string) => {
		const numberRegex = "[%+%-]?%d+%.?%d*";
		const numberMatch = toFilter.match(numberRegex)[0];

		if (numberMatch === undefined) return old;
		return numberMatch as string;
	}
};
