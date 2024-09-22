import { CreateVideStory } from "@rbxts/ui-labs";
import Vide from "@rbxts/vide";
import ResizablePanel from "UI/Holders/ResizablePanel";
import Frame from "UI/Styles/Frame";

const story = CreateVideStory(
	{
		vide: Vide,
	},
	() => {
		return (
			<Frame
				Size={new UDim2(0, 0, 0, 200)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
			>
				<ResizablePanel
					PanelSize={250}
					MinimumSize={100}
					MaximumSize={500}
					CollapseThreshold={30}
					UncollapseThreshold={80}
					HolderNative={{ BackgroundColor3: Color3.fromRGB(28, 28, 33) }}
					HandleAxis="Left"
				/>
			</Frame>
		);
	},
);

export = story;
