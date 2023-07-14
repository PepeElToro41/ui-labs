import Roact from "@rbxts/roact";
import ResizableFrame from "../UI/UIUtils/ResizableFrame";

export = function (target: ScreenGui) {
	const NewResizablePanel = (
		<ResizableFrame
			BaseSize={new UDim2(0, 300, 0, 200)}
			ResizeRange={new NumberRange(-200, 200)}
			MaxBeforeCollapse={-250}
			HolderProps={{
				Position: new UDim2(0.3, 0, 0.5, 0),
				AnchorPoint: new Vector2(0, 0.5),
			}}
			FrameProps={{
				BackgroundColor3: Color3.fromRGB(255, 255, 255),
				BackgroundTransparency: 0.5,
			}}
			HandleAnchor={"Right"}
		></ResizableFrame>
	);
	const Handler = Roact.mount(NewResizablePanel, target, "ResizablePanel");
	return () => {
		Roact.unmount(Handler);
	};
};
