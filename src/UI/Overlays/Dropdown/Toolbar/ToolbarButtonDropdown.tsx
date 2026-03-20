import React, { useCallback, useMemo } from "@rbxts/react";
import { useToolsContext } from "Context/ToolsContext";
import { useOverlayAction } from "UI/Overlays/Utils";
import { ToolButtonNames, ToolButtonType, ToolButtonsList } from "UI/StoryOverlay/IconToolbar/ToolButtonsList";
import Divisor from "UI/Utils/Divisor";
import { Counter } from "Utils/NumberUtils";

import Dropdown from "..";
import DropdownEntry from "../DropdownEntry";
import ToolbarDropdownItems from "./ToolbarDropdownItems";

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
			[props.ButtonName]: !thisButtonActive
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
