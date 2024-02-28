import Roact from "@rbxts/roact";

interface CornerProps {}

export default (props: CornerProps) => {
	return <uicorner Key="Rounder" CornerRadius={new UDim(0.5, 0)} />;
};
