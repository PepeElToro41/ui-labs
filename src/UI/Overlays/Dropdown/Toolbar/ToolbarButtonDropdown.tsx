import React from "@rbxts/react";
import { useOverlayAction } from "UI/Overlays/Utils";
import Dropdown from "..";
import DropdownEntry from "../DropdownEntry";
import Divisor from "UI/Utils/Divisor";
import ToolbarDropdownItems from "./ToolbarDropdownItems";
import { ToolButtonNames, ToolButtonType, ToolButtonsList } from "UI/StoryOverlay/IconToolbar/ToolButtonsList";
import { Counter } from "Utils/NumberUtils";

interface ToolbarButtonDropdownProps {
	Position: UDim2 | React.Binding<UDim2>;
	ButtonName: ToolButtonType;
}

function ToolbarButtonDropdown(props: ToolbarButtonDropdownProps) {
	const OnHideButton = useOverlayAction(() => {}, [props.ButtonName]);
	const count = Counter();
	const displayName = ToolButtonNames[props.ButtonName].DisplayName;

	return (
		<Dropdown Position={props.Position} Width={200}>
			<DropdownEntry LayoutOrder={count()} Text={`Hide  '${displayName}'`} OnClick={OnHideButton} />
			<Divisor Direction="X" Order={count()} />
			<ToolbarDropdownItems OrderStart={count()} />
		</Dropdown>
	);
}

export default ToolbarButtonDropdown;
