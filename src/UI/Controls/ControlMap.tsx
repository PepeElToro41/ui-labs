import BoolControl from "./ControlSet/BoolControl";
import ColorControl from "./ControlSet/ColorControl";
import NumberControl from "./ControlSet/NumberControl";
import RGBAControl from "./ControlSet/RGBAControl";
import SliderControl from "./ControlSet/SliderControl";
import StringControl from "./ControlSet/StringControl";

//here I map controls to their respective types
export = {
	//Special
	Slider: SliderControl,
	RGBA: RGBAControl,
	//Primitives
	boolean: BoolControl,
	string: StringControl,
	number: NumberControl,
	Color3: ColorControl,
};
