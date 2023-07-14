import { useEventListener } from "@rbxts/pretty-roact-hooks";
import Roact from "@rbxts/roact";
import { useMemo, useState, withHooks } from "@rbxts/roact-hooked";
import Signal from "Utils/Signal";

interface MeasureFrameProps {
	SizeMultiplier: number;
	StartMouse: Vector2;
	FrameStart: Vector2;
	MouseListener: InputSignals["MouseMoved"];
}

function setProps(props: MeasureFrameProps) {
	props.SizeMultiplier = props.SizeMultiplier ?? 1;
	return props;
}

function MeasureFrameCreate(setprops: MeasureFrameProps) {
	const props = identity<Required<MeasureFrameProps>>(setProps(setprops) as Required<MeasureFrameProps>);
	const [mousePos, setMousePos] = useState(props.StartMouse);
	const [frameSize, labelSize] = useMemo(() => {
		const relative = mousePos.sub(props.StartMouse);
		const absolute = relative.div(props.SizeMultiplier);
		return [relative, absolute];
	}, [mousePos, props.SizeMultiplier]);
	useEventListener(props.MouseListener, (mousePos, inPlugin) => {
		if (!inPlugin) return;
		setMousePos(mousePos);
	});
	const finalPos = props.StartMouse.sub(props.FrameStart);
	return (
		<frame
			Key="MeasureFrame"
			AnchorPoint={new Vector2(0, 0)}
			BackgroundTransparency={1}
			Position={UDim2.fromOffset(finalPos.X, finalPos.Y)}
			Size={UDim2.fromOffset(frameSize.X, frameSize.Y)}
		>
			<imagelabel
				Key="LineV1"
				BackgroundTransparency={0.5}
				Image="rbxassetid://13895861348"
				ScaleType={Enum.ScaleType.Tile}
				BackgroundColor3={Color3.fromRGB(0, 0, 0)}
				Size={new UDim2(1, 0, 0, 1)}
				TileSize={new UDim2(0, 10, 1, 0)}
			/>
			<imagelabel
				Key="LineH1"
				BackgroundTransparency={0.5}
				Image="rbxassetid://13895889245"
				ScaleType={Enum.ScaleType.Tile}
				BackgroundColor3={Color3.fromRGB(0, 0, 0)}
				Size={new UDim2(0, 1, 1, 0)}
				TileSize={new UDim2(1, 0, 0, 10)}
			/>
			<imagelabel
				Key="LineH2"
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
				Key="LineV2"
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
				Key="SizeLabel"
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
					Key="Label"
					AutomaticSize={Enum.AutomaticSize.X}
					BackgroundTransparency={1}
					FontFace={Font.fromName("GothamSSm", Enum.FontWeight.ExtraLight)}
					Size={new UDim2(0, 0, 1, 0)}
					Text={math.abs(math.floor(labelSize.X)) + " x " + math.abs(math.floor(labelSize.Y))}
					TextColor3={Color3.fromRGB(0, 0, 0)}
					TextSize={12}
				/>
				<uipadding PaddingLeft={new UDim(0, 5)} PaddingRight={new UDim(0, 5)} />
			</frame>
		</frame>
	);
}
const MeasureFrame = withHooks(MeasureFrameCreate);

export = MeasureFrame;
