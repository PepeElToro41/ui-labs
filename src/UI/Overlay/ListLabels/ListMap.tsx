import { _EnumListType } from "@rbxts/ui-labs/out/ControlsUtil";
import { BoolList } from "./BoolList";
import { ColorList } from "./ColorList";
import { NumberList } from "./NumberList";
import { StringList } from "./StringList";
import Roact from "@rbxts/roact";

export const ListMap = {
	Color3: ColorList,
	number: NumberList,
	string: StringList,
	boolean: BoolList,
};

export function GenerateLabel(props: { Value: _EnumListType; Description: boolean; Theme: Theme }) {
	const isType = typeOf(props.Value);
	if (!(isType in ListMap)) return;
	const SetCreator = ListMap[isType as keyof typeof ListMap];
	return Roact.createElement(SetCreator as never, { Value: props.Value, Theme: props.Theme });
}
