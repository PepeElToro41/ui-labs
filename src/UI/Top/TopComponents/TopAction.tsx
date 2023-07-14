import Roact from "@rbxts/roact";
import { useState, withHooks, withHooksPure } from "@rbxts/roact-hooked";
import { Detector } from "UI/UIUtils/Styles/Detector";
import { Text } from "UI/UIUtils/Styles/Text";

declare global {
	namespace Dropdown {
		interface IsTopAction {
			ActionName: string;
			ActionLabel: string;
			ActionHandler: () => void;
		}
	}
}

interface TopActionProps extends Dropdown.IsTopAction {
	LayoutOrder: number;
}

function setProps(props: TopActionProps) {
	return props;
}

function TopActionCreate(setprops: TopActionProps) {
	const props = identity<Required<TopActionProps>>(setProps(setprops) as Required<TopActionProps>);
	const [hovered, setHover] = useState(false);

	return (
		<Detector
			Key={props.ActionName}
			BackgroundTransparency={hovered ? 0 : 1}
			BackgroundColor3={Color3.fromRGB(56, 56, 56)}
			Size={new UDim2(1, 0, 0, 23)}
			LayoutOrder={props.LayoutOrder}
			Event={{
				MouseEnter: () => setHover(true),
				MouseLeave: () => setHover(false),
				MouseButton1Click: () => props.ActionHandler(),
			}}
		>
			<uicorner CornerRadius={new UDim(0, 4)} />
			<Text
				Key="Label"
				FontFace={Font.fromName("GothamSSm", Enum.FontWeight.ExtraLight)}
				Position={new UDim2(0, 15, 0, 0)}
				Size={new UDim2(1, -60, 1, 0)}
				Text={props.ActionLabel}
				TextXAlignment={Enum.TextXAlignment.Left}
			/>
		</Detector>
	);
}
const TopAction = withHooksPure(TopActionCreate);

export = TopAction;
