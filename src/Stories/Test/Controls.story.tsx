import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory, EnumList, InferControls, Number, Ordered } from "@rbxts/ui-labs";
import { Counter } from "Utils/NumberUtils";

const count = Counter(0);

const controls = {
	test1: Ordered(true, count()),
	test2: Ordered(false, count()),
	test3: Ordered(10, count()),
	test4: Ordered(Number(10), count()),
	test5: Ordered("Hello", count()),
	test6: Ordered(new Color3(1, 0, 0), count()),
	enumList: EnumList(
		{
			Enum1: 2,
			Enum2: "Text",
			Enum3: Color3.fromRGB(255, 80, 255),
			Enum4: () => {},
			Enum5: 3,
			Enum6: 4,
			Enum7: 5,
			Enum8: 6,
			Enum9: 7,
			Enum10: 8,
			Enum11: 9,
			Enum12: 10,
			Enum13: 11,
			Enum14: 12,
			Enum15: 13,
		},
		"Enum1",
	),
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
