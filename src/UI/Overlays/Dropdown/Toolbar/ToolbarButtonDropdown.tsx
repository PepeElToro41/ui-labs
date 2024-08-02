import React, { useCallback, useMemo } from "@rbxts/react";
import { useOverlayAction } from "UI/Overlays/Utils";
import Dropdown from "..";
import DropdownEntry from "../DropdownEntry";
import Divisor from "UI/Utils/Divisor";
import ToolbarDropdownItems from "./ToolbarDropdownItems";
import { ToolButtonNames, ToolButtonType, ToolButtonsList } from "UI/StoryOverlay/IconToolbar/ToolButtonsList";
import { Counter } from "Utils/NumberUtils";
import { useToolsContext } from "Context/ToolsContext";

interface ToolbarButtonDropdownProps {
	Position: UDim2 | React.Binding<UDim2>;
	ButtonName: ToolButtonType;
}

function ToolbarButtonDropdown(props: ToolbarButtonDropdownProps) {
	const count = Counter();
	const displayName = ToolButtonNames[props.ButtonName].DisplayName;

	const context = useToolsContext();
	const buttonsActive = context.ToolButtonsActive;
	const thisButtonActive = buttonsActive[props.ButtonName];

	const OnToggleButton = useOverlayAction(() => {
		context.SetToolButtonsActive({
			...buttonsActive,
			[props.ButtonName]: !thisButtonActive,
		});
	}, [props.ButtonName, thisButtonActive, context]);

	return (
		<Dropdown Position={props.Position} Width={200}>
			<DropdownEntry
				LayoutOrder={count()}
				Text={`${thisButtonActive ? "Hide" : "Show"}  '${displayName}'`}
				OnClick={OnToggleButton}
			/>
			<Divisor Direction="X" Order={count()} />
			<ToolbarDropdownItems OrderStart={count()} />
		</Dropdown>
	);
}

export default ToolbarButtonDropdown;
