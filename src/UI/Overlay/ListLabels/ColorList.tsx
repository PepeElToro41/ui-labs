import Roact from "@rbxts/roact";

interface ColorListProps {
	Value: Color3;
}

function setProps(props: ColorListProps) {
	return props;
}

export function ColorList(setprops: ColorListProps) {
	const props = setProps(setprops);
	return (
		<frame
			AnchorPoint={new Vector2(0, 0.5)}
			BackgroundColor3={props.Value}
			Position={UDim2.fromScale(0, 0.5)}
			Size={UDim2.fromOffset(13, 13)}
		>
			<uicorner CornerRadius={new UDim(0.5, 0)} />
		</frame>
	);
}
