import Roact, { useCallback, useEffect, useState } from "@rbxts/roact";
import { useDescriptionDisplay } from "Context/DescriptionContext";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import Corner from "UI/Styles/Corner";
import { Detector } from "UI/Styles/Detector";

interface AssignButtonProps {
	Disabled?: string;
	Order?: number;
	OnAssign: () => void;
}

function AssignButton(props: AssignButtonProps) {
	const theme = useTheme();
	const [hovered, setHover] = useState(false);
	const { DisplayDescription, RemoveDescription } = useDescriptionDisplay("InstanceAssignButton");

	const OnSelect = useCallback(() => {
		if (props.Disabled !== undefined) return;
		props.OnAssign();
	}, [props.OnAssign, props.Disabled]);

	const OnMouseEnter = useCallback(() => {
		setHover(true);
	}, []);
	const OnMouseLeave = useCallback(() => {
		setHover(false);
	}, []);

	useEffect(() => {
		if (hovered) {
			DisplayDescription(props.Disabled !== undefined ? props.Disabled : "Assign Instance");
		} else {
			RemoveDescription();
		}
	}, [hovered]);

	return (
		<frame
			Key={"SelectFrame"}
			LayoutOrder={props.Order ?? 0}
			Size={UDim2.fromOffset(23, 23)}
			BackgroundTransparency={hovered && props.Disabled === undefined ? 0.6 : 1}
		>
			<Corner Radius={6} />
			<imagelabel
				Key={"SelectIcon"}
				BackgroundTransparency={1}
				Image={"rbxassetid://16456383286"}
				ImageColor3={props.Disabled !== undefined ? theme.Text.Disabled : theme.Text.Color}
				ImageTransparency={props.Disabled !== undefined ? 0.3 : 0}
				Position={UDim2.fromScale(0.5, 0.5)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Size={UDim2.fromOffset(17, 17)}
			/>
			<Detector
				Event={{
					MouseEnter: OnMouseEnter,
					MouseLeave: OnMouseLeave,
					MouseButton1Click: OnSelect,
				}}
			/>
		</frame>
	);
}

export default AssignButton;
