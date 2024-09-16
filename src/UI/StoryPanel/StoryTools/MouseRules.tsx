import { composeBindings } from "@rbxts/pretty-react-hooks";
import React, { Binding } from "@rbxts/react";
import { useMousePos } from "Hooks/Context/UserInput";
import { Div } from "UI/Styles/Div";

interface MouseRulesProps {
	Anchor: Binding<Vector2>;
	Inside: boolean;
}

function MouseRules(props: MouseRulesProps) {
	const mousePos = useMousePos();
	const rulePos = composeBindings(props.Anchor, mousePos, (anchor, absolute) => {
		return absolute.sub(anchor);
	});

	return (
		<Div Position={UDim2.fromScale(0, 0)} Visible={props.Inside} Size={rulePos.map((pos) => UDim2.fromOffset(pos.X, pos.Y))}>
			<imagelabel
				key="LineX"
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
				key="LineY"
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
				AnchorPoint={new Vector2(1, 1)}
				AutomaticSize={Enum.AutomaticSize.X}
				BackgroundColor3={Color3.fromRGB(107, 189, 255)}
				BorderSizePixel={0}
				Position={new UDim2(1, -6, 1, 26)}
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
					Text={rulePos.map((pos) => {
						return math.abs(math.floor(pos.X)) + " x " + math.abs(math.floor(pos.Y));
					})}
					TextColor3={Color3.fromRGB(0, 0, 0)}
					TextSize={12}
				/>
				<uipadding PaddingLeft={new UDim(0, 5)} PaddingRight={new UDim(0, 5)} />
			</frame>
		</Div>
	);
}

export default MouseRules;
