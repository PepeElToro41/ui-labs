import { GetColorHex } from "Utils/MiscUtils";

export type Widen<T> = T extends number ? number : T;
export type Decoder<T extends Color3 | number> = (input: string) => Widen<T> | undefined;
export type Parser<T extends Color3 | number> = (value: Widen<T>) => string;

export const ColorDecoders = {
	Hex: (hexInput: string) => {
		hexInput = hexInput.gsub("#", "")[0];
		const [sucess, decompiled] = pcall(() => Color3.fromHex(hexInput));
		if (sucess) {
			return decompiled;
		} else {
			return undefined;
		}
	},
	RBG: (rbgInput: string) => {
		const rgbStr = rbgInput.gsub(" ", "")[0].split(",");
		let isRBGValid = true;
		rgbStr.forEach((v) => {
			if (tonumber(v) === undefined) isRBGValid = false;
		});
		if (rgbStr.size() === 3 && isRBGValid) {
			const rgbValues = {
				R: math.clamp(math.floor(tonumber(rgbStr[0])!), 0, 255),
				G: math.clamp(math.floor(tonumber(rgbStr[1])!), 0, 255),
				B: math.clamp(math.floor(tonumber(rgbStr[2])!), 0, 255)
			};
			return Color3.fromRGB(rgbValues.R, rgbValues.G, rgbValues.B);
		}
		return undefined;
	},
	Alpha: (alphaInput: string) => {
		const alpha = tonumber(alphaInput);
		if (alpha !== undefined) {
			return math.clamp(alpha, 0, 1);
		}
		return undefined;
	}
};

export const ColorParsers = {
	Hex: (color: Color3) => {
		return "#" + GetColorHex(color).upper();
	},
	RGB: (color: Color3) => {
		return `${math.floor(color.R * 255)} ,${math.floor(color.G * 255)} ,${math.floor(color.B * 255)}`;
	},
	Alpha: (alpha: number) => {
		return tostring(math.floor(alpha * 100) / 100);
	}
};
