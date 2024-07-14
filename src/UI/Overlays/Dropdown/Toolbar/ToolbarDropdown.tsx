import React from "@rbxts/react";
import Dropdown from "..";
import DropdownEntry from "../DropdownEntry";
import Divisor from "UI/Utils/Divisor";
import ToolbarDropdownItems from "./ToolbarDropdownItems";

interface ToolbarDropdownProps {
	Position: UDim2 | React.Binding<UDim2>;
}

function setProps(props: ToolbarDropdownProps) {
	return props as Required<ToolbarDropdownProps>;
}

function ToolbarDropdown(setprops: ToolbarDropdownProps) {
	const props = setProps(setprops);

	return (
		<Dropdown Position={props.Position} Width={200}>
			<ToolbarDropdownItems OrderStart={0} />
		</Dropdown>
	);
}

export default ToolbarDropdown;
