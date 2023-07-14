import Roact from "@rbxts/roact";
import { ObjectStory } from "Declarations/StoryPreview";

const returner: ObjectStory = {
	summary: "This is a story to test UI-Labs for Roact Stories, yes, Roact Stories :))\n<b>Rich Text</b>",
	roact: Roact,
	controls: {
		numberTest: 1,
		stringTest: "String yes",
		booleanTest: true,
		colorTest: Color3.fromRGB(255, 0, 0),
	},
	story: (props: UILabsProps) => {
		return (
			<frame
				Size={UDim2.fromOffset(300, 100)}
				Position={UDim2.fromScale(0.5, 0.5)}
				AnchorPoint={new Vector2(0.5, 0.5)}
			></frame>
		);
	},
};

export = returner;
