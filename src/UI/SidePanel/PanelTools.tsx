import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";
import Div from "UI/Styles/Div";
import Text from "UI/Styles/Text";
import Divisor from "UI/Utils/Divisor";

interface PanelToolsProps {}

function setProps(props: PanelToolsProps) {
	return props as Required<PanelToolsProps>;
}

function PanelToolsCreate(setprops: PanelToolsProps) {
	const props = setProps(setprops as Required<PanelToolsProps>);
	return (
		<Div
			Key={"PanelTools"}
			AnchorPoint={new Vector2(0.5, 0)}
			BackgroundTransparency={1}
			LayoutOrder={2}
			Size={new UDim2(1, -10, 0, 20)}
		>
			<Text Key={"Label"} Text={"Story Explorer"} AutomaticSize={Enum.AutomaticSize.X} Size={UDim2.fromScale(0, 0.9)} />
			<Divisor Direction={"X"} Position={new UDim2(0.5, 0, 1, 5)} />
		</Div>
	);
}
const PanelTools = withHooks(PanelToolsCreate);

export = PanelTools;
