import { useUnmountEffect } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect } from "@rbxts/roact";
import { useDescriptionDisplay } from "Context/DescriptionContext";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { useToggler } from "Hooks/Utils/Toggler";
import Corner from "UI/Styles/Corner";
import { Detector } from "UI/Styles/Detector";
import Sprite from "UI/Utils/Sprite";

interface ClearObjectProps {
	OnClick: () => void;
}

function ClearObject(props: ClearObjectProps) {
	const theme = useTheme();
	const [hovered, hoverApi] = useToggler(false);
	const { DisplayDescription, RemoveDescription } = useDescriptionDisplay("ClearAssignedObject");

	useEffect(() => {
		if (hovered) {
			DisplayDescription("Clear Assigned");
		} else {
			RemoveDescription();
		}
	}, [hovered]);

	return (
		<frame
			Key={"CloseFrame"}
			LayoutOrder={3}
			Size={UDim2.fromOffset(17, 17)}
			BackgroundTransparency={hovered ? 0.6 : 1}
			BackgroundColor3={theme.StoryPreview.CloseButton}
		>
			<Corner Radius={6} />
			<Sprite
				Key={"CloseIcon"}
				Sprite="Close"
				ImageProps={{
					ImageColor3: theme.Text.Color,
					ScaleType: Enum.ScaleType.Fit,
					Position: UDim2.fromScale(0.5, 0.5),
					AnchorPoint: new Vector2(0.5, 0.5),
					Size: UDim2.fromOffset(13, 13),
				}}
			/>
			<Detector
				Event={{
					MouseEnter: hoverApi.enable,
					MouseLeave: hoverApi.disable,
					MouseButton1Click: props.OnClick,
				}}
			/>
		</frame>
	);
}

export default ClearObject;
