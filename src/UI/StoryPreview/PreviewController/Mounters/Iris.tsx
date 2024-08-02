import React from "@rbxts/react";

interface IrisProps {}

function setProps(props: IrisProps) {
	return props as Required<IrisProps>;
}

function Iris(setprops: IrisProps) {
	const props = setProps(setprops);
	return <></>;
}

export default Iris;
