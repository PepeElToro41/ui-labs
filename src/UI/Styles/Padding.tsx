import Vide from "@rbxts/vide";

export interface PaddingProps {
	Padding?: number;
	PaddingX?: number;
	PaddingY?: number;
	Left?: number;
	Right?: number;
	Top?: number;
	Bottom?: number;
}

function setProps(props: PaddingProps) {
	if (props.PaddingX === undefined) {
		props.PaddingX = props.Padding;
	}
	if (props.PaddingY === undefined) {
		props.PaddingY = props.Padding;
	}
	return props;
}

function Padding(setprops: PaddingProps) {
	const props = setProps(setprops);
	return (
		<uipadding
			Name={"Padding"}
			PaddingLeft={new UDim(0, props.Left ?? props.PaddingX ?? 0)}
			PaddingRight={new UDim(0, props.Right ?? props.PaddingX ?? 0)}
			PaddingTop={new UDim(0, props.Top ?? props.PaddingY ?? 0)}
			PaddingBottom={new UDim(0, props.Bottom ?? props.PaddingY ?? 0)}
		/>
	);
}

export default Padding;
