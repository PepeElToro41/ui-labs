import Roact from "@rbxts/roact";
import { useOverlayAction } from "../Utils";
import Dropdown from ".";
import DropdownEntry from "./DropdownEntry";

interface ControlDropdownProps {
	Position: UDim2 | Roact.Binding<UDim2>;
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
