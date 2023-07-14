import Roact from "@rbxts/roact";

interface ImageProps extends JSX.IntrinsicElement<ImageLabel> {}

function setProps(props: ImageProps) {
	return props;
}

export function Image(setprops: ImageProps) {
	const props = setProps(setprops);
	return <imagelabel BackgroundTransparency={1} Size={new UDim2(1, 0, 1, 0)} BorderSizePixel={0} {...props}></imagelabel>;
}
