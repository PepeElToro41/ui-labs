import React, { useBinding, useCallback, useEffect, useRef, useState } from "@rbxts/react";
import { useDescriptionInfo } from "Context/DescriptionContext";
import { useMousePos, useRelativeMousePos } from "Hooks/Context/UserInput";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { useOutsideCheck } from "Hooks/Utils/OutsideWrapper";
import Corner from "UI/Styles/Corner";
import { Div } from "UI/Styles/Div";
import Padding from "UI/Styles/Padding";
import Text from "UI/Styles/Text";

interface DescriptionDisplayProps {}

function DescriptionDisplay(props: DescriptionDisplayProps) {
	const theme = useTheme();
	const description = useDescriptionInfo();
	const mousePos = useRelativeMousePos();
	const [descriptionSize, setDescriptionSize] = useBinding(Vector2.zero);
	const [wrapped, setWrapped] = useState(false);
	const OutsideCheck = useOutsideCheck(mousePos, descriptionSize);

	const [frozenPosition, setFrozenPosition] = useState<Vector2>(() => mousePos.getValue());

	useEffect(() => {
		const currentPos = mousePos.getValue();
		setFrozenPosition(currentPos);

		const isOutside = OutsideCheck(Vector2.zero, "X");
		setWrapped(isOutside);
	}, [description]);

	const OnAbsoluteSizeChanged = useCallback((frame: Frame) => {
		setDescriptionSize(frame.AbsoluteSize);
	}, []);

	const padding = wrapped ? UDim2.fromOffset(-2, 17) : UDim2.fromOffset(12, 17);
	return (
		<frame
			key="Descriptor"
			AnchorPoint={wrapped ? new Vector2(1, 0) : new Vector2(0, 0)}
			Position={UDim2.fromOffset(frozenPosition.X, frozenPosition.Y).add(padding)}
			AutomaticSize={Enum.AutomaticSize.X}
			BackgroundColor3={theme.Text.Color}
			BorderSizePixel={0}
			Size={new UDim2(0, 0, 0, 23)}
			Visible={description !== undefined}
			Change={{
				AbsoluteSize: OnAbsoluteSizeChanged,
			}}
		>
			<Text
				key="DescriptionText"
				AnchorPoint={new Vector2(0, 0.5)}
				AutomaticSize={Enum.AutomaticSize.XY}
				FontFace={Font.fromName("GothamSSm", Enum.FontWeight.Light)}
				Position={new UDim2(0, 0, 0.5, 0)}
				Text={description ?? ""}
				TextColor3={theme.Text.Inverted}
				TextSize={12}
			/>
			<Padding PaddingX={8} />
			<Corner Radius={4} />
		</frame>
	);
}

export default DescriptionDisplay;
