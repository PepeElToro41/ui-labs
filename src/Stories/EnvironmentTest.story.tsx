import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory, Environment } from "@rbxts/ui-labs";
import Corner from "UI/Styles/Corner";

const controls = {};

const returnStory = CreateReactStory(
	{
		summary: "",
		react: React,
		reactRoblox: ReactRoblox,
		controls: controls,
	},
	(props) => {
		return (
			<frame Size={UDim2.fromOffset(150, 50)}>
				<Corner />
				<textlabel
					Text={"TextSet"}
					Size={UDim2.fromScale(1, 1)}
					BackgroundTransparency={1}
					TextSize={18}
					FontFace={Font.fromEnum(Enum.Font.GothamBold)}
				/>
			</frame>
		);
	},
);

export = returnStory;
