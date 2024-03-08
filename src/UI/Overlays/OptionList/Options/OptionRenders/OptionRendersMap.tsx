import React from "@rbxts/react";
import TextRenderer from "./TextRenderer";
import Color3Renderer from "./Color3";
import FunctionRenderer from "./FunctionRenderer";

export type OptionRendererFactory<T extends keyof CheckableTypes = keyof CheckableTypes> = (props: {
	Value: CheckableTypes[T];
	ValueType: T;
	IsDescription: boolean;
}) => React.Element;

type OptionsRendersMap = {
	[K in keyof CheckableTypes]?: OptionRendererFactory<K>;
};

export const OptionsRendersMap: OptionsRendersMap = {
	number: (props) => {
		const input = math.floor(props.Value * 100) / 100;
		return <TextRenderer Text={tostring(input)} IsDescription={props.IsDescription} />;
	},
	string: (props) => {
		return <TextRenderer Text={props.Value} IsDescription={props.IsDescription} />;
	},
	boolean: (props) => {
		return <TextRenderer Text={props.Value ? "true" : "false"} IsDescription={props.IsDescription} />;
	},
	function: FunctionRenderer,
	Color3: Color3Renderer,
};

export const DefaultOptionRenderer: OptionRendererFactory = (props) => {
	return <TextRenderer Text={props.ValueType} IsDescription={props.IsDescription} />;
};
