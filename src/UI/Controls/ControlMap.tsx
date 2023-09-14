import BoolControl from "./ControlSet/BoolControl";
import ChooseControl from "./ControlSet/ChooseControl";
import { ColorControl } from "./ControlSet/ColorControl";
import EnumControl from "./ControlSet/EnumListControl";
import NumberControl from "./ControlSet/NumberControl";
import RGBAControl from "./ControlSet/RGBAControl";
import SliderControl from "./ControlSet/SliderControl";
import StringControl from "./ControlSet/StringControl";

//here I map controls to their respective types
export = {
	//Special
	Slider: SliderControl,
	RGBA: RGBAControl,
	EnumList: EnumControl,
	Choose: ChooseControl,
	//Primitives
	boolean: BoolControl,
	string: StringControl,
	number: NumberControl,
	Color3: ColorControl,
} as const;
