import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory } from "@rbxts/ui-labs";
import LeftList from "UI/Styles/List/LeftList";
import Padding from "UI/Styles/Padding";

export = CreateReactStory({ react: React, reactRoblox: ReactRoblox }, () => {
	return (
		<frame
			Position={UDim2.fromOffset(100, 50)}
			Size={UDim2.fromOffset(300, 100)}
			ClipsDescendants={true}
		>
			<LeftList Padding={new UDim(0, 6)} />
			<Padding Padding={8} />
			<frame
				Size={UDim2.fromScale(1, 1)}
				SizeConstraint={Enum.SizeConstraint.RelativeYY}
				BackgroundColor3={Color3.fromRGB(255, 0, 0)}
			/>
			<frame
				Size={UDim2.fromScale(1, 1)}
				SizeConstraint={Enum.SizeConstraint.RelativeYY}
				BackgroundColor3={Color3.fromRGB(255, 0, 0)}
			/>
			<frame
				Size={UDim2.fromScale(1, 1)}
				SizeConstraint={Enum.SizeConstraint.RelativeYY}
				BackgroundColor3={Color3.fromRGB(255, 0, 0)}
			/>
			<frame
				Size={UDim2.fromScale(1, 1)}
				SizeConstraint={Enum.SizeConstraint.RelativeYY}
				BackgroundColor3={Color3.fromRGB(255, 0, 0)}
			/>
			<frame
				Size={UDim2.fromScale(1, 1)}
				SizeConstraint={Enum.SizeConstraint.RelativeYY}
				BackgroundColor3={Color3.fromRGB(255, 0, 0)}
			/>
		</frame>
	);
});
