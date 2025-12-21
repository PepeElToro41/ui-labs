import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory } from "@rbxts/ui-labs";

const controls = {};

const returnStory = CreateReactStory(
	{
		summary: "",
		react: React,
		reactRoblox: ReactRoblox,
		controls: controls
	},
	(props) => {
		return (
			<frame Size={UDim2.fromOffset(100, 100)}>
				<frame
					key={"SHOW"}
					BackgroundTransparency={1}
					Size={UDim2.fromOffset(70, 70)}
					Position={UDim2.fromOffset(10, 10)}
				></frame>
			</frame>
		);
	}
);

export = returnStory;
