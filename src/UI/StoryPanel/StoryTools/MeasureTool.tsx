import { composeBindings, useEventListener } from "@rbxts/pretty-react-hooks";
import React, { Binding, useBinding } from "@rbxts/react";
import { useInputBegan, useInputEnded, useMousePos } from "Hooks/Context/UserInput";
import { useStoryLockAction } from "./Utils";

interface MeasureToolProps {
	Inside: boolean;
	Anchor: Binding<Vector2>;
}

function MeasureTool(props: MeasureToolProps) {
	const mousePos = useMousePos();
	const inputBegan = useInputBegan();
	const inputEnded = useInputEnded();
	const [measureStart, setMeasureStart] = useBinding<Vector2 | undefined>(undefined);

	useStoryLockAction("MeasureTool", props.Inside);

	const labelPos = composeBindings(props.Anchor, measureStart, (anchor, absolute) => {
		if (absolute === undefined) return Vector2.zero;
		return absolute.sub(anchor);
	});
	const labelSize = composeBindings(measureStart, mousePos, (start, current) => {
		if (!start) return Vector2.zero;
		return current.sub(start);
	});

	useEventListener(inputBegan, (input) => {
		if (input.UserInputType !== Enum.UserInputType.MouseButton1) return;
		if (!props.Inside) return;
		const pos = mousePos.getValue();
		setMeasureStart(pos);
	});
	useEventListener(inputEnded, (input) => {
		if (input.UserInputType !== Enum.UserInputType.MouseButton1) return;
		setMeasureStart(undefined);
	});

	return (
		<frame
			key="MeasureFrame"
			AnchorPoint={new Vector2(0, 0)}
			Visible={measureStart.map((start) => start !== undefined)}
			BackgroundTransparency={1}
			Position={labelPos.map((pos) => UDim2.fromOffset(pos.X, pos.Y))}
			Size={labelSize.map((size) => UDim2.fromOffset(size.X, size.Y))}
		>
			<imagelabel
				key="LineV1"
				BackgroundTransparency={0.5}
				Image="rbxassetid://13895861348"
				ScaleType={Enum.ScaleType.Tile}
				BackgroundColor3={Color3.fromRGB(0, 0, 0)}
				Size={new UDim2(1, 0, 0, 1)}
				TileSize={new UDim2(0, 10, 1, 0)}
			/>
			<imagelabel
				key="LineH1"
				BackgroundTransparency={0.5}
				Image="rbxassetid://13895889245"
				ScaleType={Enum.ScaleType.Tile}
				BackgroundColor3={Color3.fromRGB(0, 0, 0)}
				Size={new UDim2(0, 1, 1, 0)}
				TileSize={new UDim2(1, 0, 0, 10)}
			/>
			<imagelabel
				key="LineH2"
				AnchorPoint={new Vector2(1, 0)}
				BackgroundTransparency={0.5}
				Image="rbxassetid://13895889245"
				Position={new UDim2(1, 0, 0, 0)}
				ScaleType={Enum.ScaleType.Tile}
				BackgroundColor3={Color3.fromRGB(0, 0, 0)}
				Size={new UDim2(0, 1, 1, 0)}
				TileSize={new UDim2(1, 0, 0, 10)}
			/>
			<imagelabel
				key="LineV2"
				AnchorPoint={new Vector2(0, 1)}
				BackgroundTransparency={0.5}
				Image="rbxassetid://13895861348"
				Position={new UDim2(0, 0, 1, 0)}
				ScaleType={Enum.ScaleType.Tile}
				BackgroundColor3={Color3.fromRGB(0, 0, 0)}
				Size={new UDim2(1, 0, 0, 1)}
				TileSize={new UDim2(0, 10, 1, 0)}
			/>
			<frame
				key="SizeLabel"
				AnchorPoint={new Vector2(0, 1)}
				AutomaticSize={Enum.AutomaticSize.X}
				BackgroundColor3={Color3.fromRGB(255, 206, 147)}
				BorderSizePixel={0}
				Position={new UDim2(1, 7, 1, -7)}
				Size={new UDim2(0, 0, 0, 18)}
			>
				<uicorner CornerRadius={new UDim(0, 5)} />
				<uipadding PaddingLeft={new UDim(0, 5)} PaddingRight={new UDim(0, 5)} PaddingTop={new UDim(0, 2)} />
				<textlabel
					key="Label"
					AutomaticSize={Enum.AutomaticSize.X}
					BackgroundTransparency={1}
					FontFace={Font.fromName("GothamSSm", Enum.FontWeight.Medium)}
					Size={new UDim2(0, 0, 1, 0)}
					Text={labelSize.map((size) => {
						return math.abs(math.floor(size.X)) + " x " + math.abs(math.floor(size.Y));
					})}
					TextColor3={Color3.fromRGB(0, 0, 0)}
					TextSize={12}
				/>
				<uipadding PaddingLeft={new UDim(0, 5)} PaddingRight={new UDim(0, 5)} />
			</frame>
		</frame>
	);
}

export default MeasureTool;
