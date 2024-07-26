import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory } from "@rbxts/ui-labs";
import { Environment } from "@rbxts/ui-labs";

const controls = {
	Color: Color3.fromRGB(25555, 0, 0),
	Number: 10,
};

const RANDOMNUMB = BrickColor.random();

const story = CreateReactStory({ controls: controls, react: React, reactRoblox: ReactRoblox }, (props) => {
	return <frame BackgroundColor3={RANDOMNUMB.Color} Size={UDim2.fromOffset(200, 200)}></frame>;
});
export = story;
