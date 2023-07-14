import BoolControl from "./ControlSet/BoolControl";
import ColorControl from "./ControlSet/ColorControl";
import NumberControl from "./ControlSet/NumberControl";
import SliderControl from "./ControlSet/SliderControl";
import StringControl from "./ControlSet/StringControl";

//here I map controls to their respective types
export = {
	boolean: BoolControl,
	Slider: SliderControl,
	string: StringControl,
	number: NumberControl,
	Color3: ColorControl,
};
