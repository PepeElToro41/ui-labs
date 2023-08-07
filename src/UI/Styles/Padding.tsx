import Roact from "@rbxts/roact";

interface PaddingProps {
	Padding?: number;
	PaddingX?: number;
	PaddingY?: number;
}

function setProps(props: PaddingProps) {
	if (props.Padding) {
		props.PaddingX = props.Padding;
		props.PaddingY = props.Padding;
	}
	return props;
}

export = (setprops: PaddingProps) => {
	const props = setProps(setprops);
	return (
		<uipadding
			Key={"Padding"}
			PaddingLeft={new UDim(0, props.PaddingX ?? 0)}
			PaddingRight={new UDim(0, props.PaddingX ?? 0)}
			PaddingTop={new UDim(0, props.PaddingY ?? 0)}
			PaddingBottom={new UDim(0, props.PaddingY ?? 0)}
		></uipadding>
	);
};
