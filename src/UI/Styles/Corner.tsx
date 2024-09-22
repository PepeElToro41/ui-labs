import Vide from "@rbxts/vide";

interface CornerProps {
	Radius?: number;
}

function Corner(props: CornerProps) {
	return <uicorner CornerRadius={new UDim(0, props.Radius ?? 8)} />;
}

export default Corner;
