import Roact from "@rbxts/roact";
import { Dictionary } from "@rbxts/sift";

interface DivProps extends Roact.JsxInstance<Frame> {
	Reference?: Roact.Ref<Frame>;
}

export function Div(props: DivProps) {
	const setRef = props.Reference;
	props.Reference = undefined;
	return (
		<frame
			BackgroundTransparency={1}
			Size={new UDim2(1, 0, 1, 0)}
			Position={new UDim2(0, 0, 0, 0)}
			BorderSizePixel={0}
			{...props}
			Ref={setRef}
		></frame>
	);
}
