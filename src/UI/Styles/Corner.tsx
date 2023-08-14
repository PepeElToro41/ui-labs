import Roact from "@rbxts/roact";

interface CornerProps {
	Size?: number;
}

export = (props: CornerProps) => {
	return <uicorner CornerRadius={new UDim(0, props.Size ?? 8)} />;
};
