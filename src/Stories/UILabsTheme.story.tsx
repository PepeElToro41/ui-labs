import React, { useEffect } from "@rbxts/react";
import { ReflexProvider, useProducer } from "@rbxts/react-reflex";
import ReactRoblox from "@rbxts/react-roblox";
import { ControlGroup, CreateReactStory, InferControls } from "@rbxts/ui-labs";
import { ReturnControls } from "@rbxts/ui-labs/src/ControlTypings/Typing";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { RootProducer } from "Reflex";
import Themes from "Themes";
import App from "UI/App";

const controls = {};

function Cast<T>(val: unknown): T {
	return val as T;
}

function GenerateControls(baseTheme: Theme) {
	const generated: ReturnControls = {};

	for (const [index, val] of pairs(baseTheme)) {
		if (typeIs(val, "table")) {
			const indexControls = GenerateControls(Cast<Theme>(val));
			generated[index] = ControlGroup(indexControls as any);
			continue;
		}
		generated[index] = Cast<Color3 | number>(val);
	}

	return generated;
}

function StoryCreate(props: { Controls: InferControls<typeof controls> }) {
	const { setTheme } = useProducer<RootProducer>();

	useEffect(() => {
		setTheme(Cast<Theme>({ ...props.Controls }));
	}, [props.Controls]);

	return <App></App>;
}

const returnStory = CreateReactStory(
	{
		summary: "",
		react: React,
		reactRoblox: ReactRoblox,
		controls: GenerateControls(Themes.Dark),
	},
	(props) => {
		return (
			<ReflexProvider producer={RootProducer}>
				<StoryCreate Controls={props.controls} />
			</ReflexProvider>
		);
	},
);

export = returnStory;
