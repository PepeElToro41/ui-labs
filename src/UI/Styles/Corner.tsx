import Roact from "@rbxts/roact";

interface CornerProps {
	Radius?: number;
}

export default (props: CornerProps) => {
	return <uicorner CornerRadius={new UDim(0, props.Radius ?? 8)} />;
};
