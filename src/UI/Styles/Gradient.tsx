import Vide from "@rbxts/vide";

interface GradientProps {
	Start: Color3;
	End: Color3;
	Rotation?: number;
}

function Gradient(props: GradientProps) {
	return (
		<uigradient
			Color={
				new ColorSequence([new ColorSequenceKeypoint(0, props.Start), new ColorSequenceKeypoint(1, props.End)])
			}
			Rotation={props.Rotation ?? 0}
		/>
	);
}

export default Gradient;
