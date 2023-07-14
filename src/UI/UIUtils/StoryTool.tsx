import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";
import ThemeContext from "UI/Contexts/ThemeContext";
import IconButton from "./IconButton";

interface StoryToolProps {
	Icon: {
		Pos?: UDim2;
		Size?: UDim2;
		RectOffset: Vector2;
		RectSize?: Vector2;
	};
	ButtonName?: string;
	Description?: string;
	LayoutOrder?: number;
	Toggleable?: boolean;
	OnClick: (active?: boolean) => void;
}

function setProps(props: StoryToolProps) {
	return props;
}

function StoryToolCreate(setprops: StoryToolProps) {
	const props = identity<Required<StoryToolProps>>(setProps(setprops) as Required<StoryToolProps>);
	return (
		<IconButton
			ButtonName={props.ButtonName ?? "Tool"}
			Size={UDim2.fromOffset(35, 35)}
			Description={props.Description}
			LayoutOrder={props.LayoutOrder}
			Icon={props.Icon}
			Toggeable={props.Toggleable}
			OnClick={props.OnClick}
		></IconButton>
	);
}
const StoryTool = withHooks(StoryToolCreate);

export = StoryTool;
