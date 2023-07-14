import Roact from "@rbxts/roact";

const Story = {
	story: (props: {}) => {
		return Roact.createElement("TextLabel", {
			Text: "Hello UI-LABS!",
			TextColor3: new Color3(1, 1, 1),
			BackgroundColor3: new Color3(0.3, 0.3, 0.3),
			TextSize: 20,
			Size: UDim2.fromOffset(300, 50),
		});
	},
	roact: Roact,
	summary: "This is a test story.",
	cleanup: () => {
		print("Im getting unmounted!");
	},
};
export = Story;
