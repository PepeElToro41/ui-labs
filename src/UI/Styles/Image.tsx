import Vide, { InstanceAttributes } from "@rbxts/vide";

interface ImageProps extends InstanceAttributes<ImageLabel> {}

function Image(props: ImageProps) {
	return (
		<imagelabel Size={new UDim2(1, 0, 1, 0)} BorderSizePixel={0} BackgroundTransparency={1} {...props}>
			{props.children}
		</imagelabel>
	);
}

export default Image;
