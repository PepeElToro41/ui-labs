import React from "@rbxts/react";

import Dropdown from ".";
import { useOverlayAction } from "../Utils";
import DropdownEntry from "./DropdownEntry";

interface ControlDropdownProps {
	Position: UDim2 | React.Binding<UDim2>;
	ControlReset: () => void;
}

function ControlDropdown(props: ControlDropdownProps) {
	const OnControlReset = useOverlayAction(() => props.ControlReset(), []);

	return (
		<Dropdown Position={props.Position} Width={160}>
			<DropdownEntry Text="Reset Control" OnClick={OnControlReset} />
		</Dropdown>
	);
}

export default ControlDropdown;
