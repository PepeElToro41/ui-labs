import Vide from "@rbxts/vide";

const ANCHOR_INFOS = {
	TopLeft: {
		AnchorPoint: new Vector2(0, 0),
		Position: UDim2.fromScale(0, 0),
	},
	TopRight: {
		AnchorPoint: new Vector2(1, 0),
		Position: UDim2.fromScale(0.5, 0),
	},
	BottomLeft: {
		AnchorPoint: new Vector2(0, 1),
		Position: UDim2.fromScale(0, 0.5),
	},
	BottomRight: {
		AnchorPoint: new Vector2(1, 1),
		Position: UDim2.fromScale(0.5, 0.5),
	},
};
type AnchorPoint = keyof typeof ANCHOR_INFOS;

interface SquaredProps {
	Anchor: AnchorPoint;
	BackgroundColor3: Color3;
}

function Squared(props: SquaredProps) {
	return (
		<frame
			BackgroundColor3={props.BackgroundColor3}
			BorderSizePixel={0}
			Size={UDim2.fromScale(0.5, 0.5)}
			Position={ANCHOR_INFOS[props.Anchor].Position}
		></frame>
	);
}

export default Squared;
