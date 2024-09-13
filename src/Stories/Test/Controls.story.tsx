import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory, InferControls, Number, Ordered } from "@rbxts/ui-labs";
import { Counter } from "Utils/NumberUtils";

const count = Counter(0);

const controls = {
	test1: Ordered(true, count()),
	test2: Ordered(false, count()),
	test3: Ordered(10, count()),
	test4: Ordered(Number(10), count()),
	test5: Ordered("Hello", count()),
	test6: Ordered(new Color3(1, 0, 0), count()),
};

function StoryCreate(props: { Controls: InferControls<typeof controls> }) {
	return <></>;
}

const returnStory = CreateReactStory(
	{
		summary: "",
		react: React,
		reactRoblox: ReactRoblox,
		controls: controls,
	},
	(props) => {
		return <StoryCreate Controls={props.controls} />;
	},
);

export = returnStory;
